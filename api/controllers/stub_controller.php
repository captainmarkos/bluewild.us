<?php

// This class provides a RESTful interface and returns a JSON response.

require_once('classes/db_helpers.php');

class UsersController {
    private $dbh;
    private $db_helpers;

    const MISSING_DB_HANDLE = "DB handle is NULL";

    public function __construct($dbh=null) {
        // A database handle is required in the constructor.
        if(!$dbh) {
            throw new InvalidArgumentException(self::MISSING_DB_HANDLE);
        }
        $this->dbh = $dbh;
        $this->db_helpers = new DBHelpers($this->dbh);
    }

    public function get($request) {
        if(!empty($request->url_elements[2])) {
            // GET  /users/11    return single json data from id=11
            // curl "http://bluewild.local/api/users/11"
            $user_id = (int)$request->url_elements[2];
            $data = $this->find($user_id);
        }
        else {
            // GET  /users    return a json array of all users
            // curl "http://bluewild.local/api/users"
            $data = $this->find();
        }
        return $data;
    }

    public function post($request) {
       $post_action = isset($request->parameters['action']) ? $request->parameters['action'] : null;

       if($post_action && $post_action == 'login') {
            // POST /users?action=login
            // curl --data "email=captainmarkos@gmail.com&passwd=markmark" "http://bluewild.local/api/users?action=login"
            $email = $request->parameters['email'];
            $passwd = $request->parameters['passwd'];
            $data = $this->login($email, $passwd);
        }
       else if(!empty($request->url_elements[2])) {
            // POST  /users/11 with post data       return a single json
            // curl --data "billing_fname=BOB MARLEY" "http://bluewild.local/api/users/11"
            $user_id = (int)$request->url_elements[2];
            $data = $this->update_user($user_id, $request->parameters);
        }
        else {
            // POST  /users/users with post data    return a single json
            // curl --data "billing_fname=DUDE" "http://bluewild.local/api/users"
            $data = $this->create_user($request->parameters);
        }
        return $data;
    }

    public function delete($request) {
        // DELETE /users/466    return a single json
        // curl -i -H "Accept: application/json" -X DELETE http://bluewild.local/api/users/466
        if(!empty($request->url_elements[2])) {
            $user_id = (int)$request->url_elements[2];
            $data = $this->delete_user($user_id);
            return $data;
        }
        return $this->query_failed('9999', 'DELETE action error');
    }

    private function create_user($params) {
        $column_names = ''; 
        $column_values = array();
        $qmarks = array();
        //echo "params: "; var_dump($params);

        foreach($params as $k => $v) {
            $column_names .= $k . ',';
            array_push($column_values, $v);
            array_push($qmarks, '?');
        }
        $column_names = rtrim($column_names, ',');

        $sql  = "INSERT INTO diver_accounts (" . $column_names . ") ";
        $sql .= "VALUES (" . implode($qmarks, ',') . ")";
        $sql = $this->db_helpers->construct_secure_query($sql, $column_values);
        $res = $this->dbh->query($sql);
        if(!$res) {
            return $this->query_failed($this->dbh->errno, $this->dbh->error);
        }
        return $this->find($this->dbh->insert_id);
    }

    private function update_user($id, $params) {
        if(empty($id)) return $this->query_failed('9999', 'id is empty');

        $column_names = '';
        $column_values = array();

        foreach($params as $k => $v) {
            $column_names .= $k . '=?,';
            array_push($column_values, $v);
        }
        $column_names = rtrim($column_names, ',');

        $sql = "UPDATE diver_accounts set " . $column_names . "WHERE id=?";
        array_push($column_values, $id);

        $sql = $this->db_helpers->construct_secure_query($sql, $column_values);
        $res = $this->dbh->query($sql);
        if(!$res) {
            return $this->query_failed($this->dbh->errno, $this->dbh->error);
        }

        return $this->find($id);
    }

    private function delete_user($id) {
        $sql  = "UPDATE diver_accounts set deleted='Y' WHERE ";
        $sql .= "id=?";
        $sql = $this->db_helpers->construct_secure_query($sql, $id);
        $res = $this->dbh->query($sql);
        if(!$res) {
            return $this->query_failed($this->dbh->errno, $this->dbh->error);
        }
        return $this->find($id, 'Y');
    }

    private function find($id=null, $deleted='N') {
        $params = array();
        if($id) {
            $sql = "SELECT * FROM diver_accounts WHERE id=? AND deleted=?";
            $params = array($id, $deleted);
        }
        else {
            $sql = "SELECT * FROM diver_accounts WHERE deleted=?";
            $params = array($deleted);
        }

        $sql = $this->db_helpers->construct_secure_query($sql, $params);
        $res = $this->dbh->query($sql);
        if(!$res)
            return $this->query_failed($this->dbh->errno, $this->dbh->error);
        if($res->num_rows < 1)
            return $this->query_failed('9999', 'no records found');

        $i = 1;
        $data = array();
        while($row = $res->fetch_assoc()) {
            $data[$i++] = $row;
        }
        return ($res->num_rows > 1) ? json_encode($data) : json_encode($data[1]);
    }


    private function login($email, $passwd) {
        $sql  = "SELECT * FROM diver_accounts WHERE email=? AND passwd=?";
        $params = array($email, $passwd);

        $sql = $this->db_helpers->construct_secure_query($sql, $params);
        $res = $this->dbh->query($sql);
        if(!$res)
            return $this->query_failed($this->dbh->errno, $this->dbh->error);
        if($res->num_rows < 1)
            return $this->query_failed('6900', 'user not found for email: ' . $email);

        $i = 1;
        $data = array();
        while($row = $res->fetch_assoc()) {
            $data[$i++] = $row;
        }
        return ($res->num_rows > 1) ? json_encode($data) : json_encode($data[1]);        
    }

    private function query_failed($errno, $error) {
        $data = array('status' => 'failed',
                      'timestamp' => date("Y-m-d H:i:s"),
                      'errno' => $errno,
                      'error' => $error);
        return json_encode($data);
    }
}

?>
