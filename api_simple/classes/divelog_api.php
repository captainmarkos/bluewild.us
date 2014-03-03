<?php

// This class provides methods to query the divelog table and returns
// the results as JSON.  A database handle is required in the constructor.

require_once('db_helpers.php');

class DivelogAPI {
    var $dbh;
    var $db_helpers;
    const MISSING_DB_HANDLE = "DB handle is NULL";

    public function __construct($dbh=null) {
        if(!$dbh) {
            throw new InvalidArgumentException(self::MISSING_DB_HANDLE);
        }
        $this->dbh = $dbh;
        $this->db_helpers = new DBHelpers($this->dbh);
    }

    public function find_by_id($id) {
        $sql = "SELECT * FROM divelog WHERE id=? AND deleted='N'";
        $sql = $this->db_helpers->construct_secure_query($sql, array($id));
        $res = $this->dbh->query($sql);
        if(!$res) {
            return query_failed($this->dbh->errno, $this->dbh->error);
        }

        $i = 1;
        $data = array();
        while($row = $res->fetch_assoc()) {
            $data[$i++] = $row;
        }
        return json_encode($data);
    }

    public function find_all($email) {
        $sql = "SELECT * FROM divelog WHERE email=? AND deleted='N' ORDER BY dive_no";
        $sql = $this->db_helpers->construct_secure_query($sql, array($email));
        $res = $this->dbh->query($sql);
        if(!$res) {
            return query_failed($this->dbh->errno, $this->dbh->error);
        }

        $row_cnt = $res->num_rows;
        $data = array();
        $json_record = 1;
        while($row = $res->fetch_assoc()) {
            $data[$json_record++] = $row;
        }
        return json_encode($data);
    }

    private function query_failed($errno, $error) {
        $data = array('status' => 'error',
                      'errno' => $errno,
                      'error' => $error);
        return json_encode($data);
    }
}

?>