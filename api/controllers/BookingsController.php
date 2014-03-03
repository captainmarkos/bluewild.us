<?php

// This class provides a RESTful interface and returns a JSON response.

require_once('classes/db_helpers.php');

class BookingsController {
    private $dbh;
    private $db_helpers;

    const MISSING_DB_HANDLE = "DB handle is NULL";

    public function __construct($dbh=null) {
        if(!$dbh) {
            throw new InvalidArgumentException(self::MISSING_DB_HANDLE);
        }
        $this->dbh = $dbh;
        $this->db_helpers = new DBHelpers($this->dbh);
    }

    public function get($request) {
        if(!empty($request->url_elements[2])) {
            // GET  /bookings/5100    return single json data from id=5100
            // curl "http://bluewild.local/api/bookings/5100"
            $id = (int)$request->url_elements[2];
            $data = $this->find($id);
        }
        else {
            // GET  /bookings    return a json array of all users
            // curl "http://bluewild.local/api/bookings"
            $data = $this->find();
        }
        return $data;
    }

    public function post($request) {
       $post_action = isset($request->parameters['action']) ? $request->parameters['action'] : null;

       if(!empty($request->url_elements[2])) {
            // POST  /bookings/5100 with post data       return a single json
            // curl --data "email=wet@lauderdalediver.com" "http://bluewild.local/api/bookings/5100"
            $user_id = (int)$request->url_elements[2];
            $data = $this->update_booking($user_id, $request->parameters);
        }
        else {
            // POST  /bookings/bookings with post data    return a single json
            // curl --data "email=foo@bar2.com" "http://bluewild.local/api/bookings"
            $data = $this->create_booking($request->parameters);
        }
        return $data;
    }

    public function delete($request) {
        // DELETE /bookings/5100    return a single json
        // curl -i -H "Accept: application/json" -X DELETE http://bluewild.local/api/bookings/5100
        if(!empty($request->url_elements[2])) {
            $id = (int)$request->url_elements[2];
            $data = $this->delete_booking($id);
            return $data;
        }
        return $this->query_failed('9999', 'DELETE action error');
    }

    private function create_booking($params) {
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

        $sql  = "INSERT INTO bookings (" . $column_names . ") ";
        $sql .= "VALUES (" . implode($qmarks, ',') . ")";
        $sql = $this->db_helpers->construct_secure_query($sql, $column_values);
        $res = $this->dbh->query($sql);
        if(!$res) {
            return $this->query_failed($this->dbh->errno, $this->dbh->error);
        }
        return $this->find($this->dbh->insert_id);
    }

    private function update_booking($id, $params) {
        if(empty($id)) return $this->query_failed('9999', 'id is empty');

        $column_names = '';
        $column_values = array();

        foreach($params as $k => $v) {
            $column_names .= $k . '=?,';
            array_push($column_values, $v);
        }
        $column_names = rtrim($column_names, ',');

        $sql = "UPDATE bookings set " . $column_names . "WHERE id=?";
        array_push($column_values, $id);

        $sql = $this->db_helpers->construct_secure_query($sql, $column_values);
        $res = $this->dbh->query($sql);
        if(!$res) {
            return $this->query_failed($this->dbh->errno, $this->dbh->error);
        }

        return $this->find($id);
    }

    private function delete_booking($id) {
        $sql  = "UPDATE bookings set deleted='Y' WHERE id=?";
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
            $sql = "SELECT * FROM bookings WHERE id=? AND deleted=?";
            $params = array($id, $deleted);
        }
        else {
            $sql = "SELECT * FROM bookings WHERE deleted=?";
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

    private function find_by_email($email) {
        $sql = "SELECT * FROM bookings WHERE email=? AND deleted='N' ORDER BY id";
        $sql = $this->db_helpers->construct_secure_query($sql, array($email));
        $res = $this->dbh->query($sql);
        if(!$res) {
            return query_failed($this->dbh->errno, $this->dbh->error);
        }
        if($res->num_rows < 1)
            return $this->query_failed('9999', 'no records found');

        $i = 1;
        $data = array();
        while($row = $res->fetch_assoc()) {
            $data[$i++] = $row;
        }
        return ($res->num_rows > 1) ? json_encode($data) : json_encode($data[1]);
    }

    private function query_failed($errno, $error) {
        $data = array('status' => 'error',
                      'errno' => $errno,
                      'error' => $error);
        return json_encode($data);
    }
}

?>
