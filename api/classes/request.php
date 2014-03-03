<?php

class Request {
    public $url_elements;
    public $verb;
    public $parameters;
 
    public function __construct() {
        $this->verb = $_SERVER['REQUEST_METHOD'];

        // Checkout this post regarding using PATH_INFO and QUERY_STRING:
        //   http://stackoverflow.com/questions/14555996/no-input-file-specified

        // This is needed locally (and appropriate .htaccess).
        $this->url_elements = explode('/', $_SERVER['PATH_INFO']);

        // This is needed for the godaddy hosting server (and .htaccess).
        //$this->url_elements = explode('/', $_SERVER['QUERY_STRING']);

        $this->parseIncomingParams();

        // initialise json as default format
        $this->format = 'json';
        if(isset($this->parameters['format'])) {
            $this->format = $this->parameters['format'];
        }
        return true;
    }
 
    public function parseIncomingParams() {
        $parameters = array();
 
        // First of all, pull the GET vars
        if(isset($_SERVER['QUERY_STRING'])) {
            parse_str($_SERVER['QUERY_STRING'], $parameters);
        }
 
        // Now how about PUT/POST bodies? These override what we got from GET
        $body = file_get_contents("php://input");
        $content_type = false;
        if(isset($_SERVER['CONTENT_TYPE'])) {
            $content_type = strtolower($_SERVER['CONTENT_TYPE']);
        }

        // I found in some instances that the content_type was "application/json;charset=UTF-8".
        $content_type = (strpos($content_type, 'json') !== false) ? 'application/json' : $content_type;

        switch($content_type) {
            case "application/json":
                $body_params = json_decode($body);
                if($body_params) {
                    foreach($body_params as $param_name => $param_value) {
                        $parameters[$param_name] = $param_value;
                    }
                }
                $this->format = "json";
                break;
            case "application/x-www-form-urlencoded":
                parse_str($body, $postvars);
                foreach($postvars as $field => $value) {
                    $parameters[$field] = $value;
 
                }
                $this->format = "html";
                break;
            default:
                // Unsupported content type
                //echo "\nRequest::parseIncomingParams() - ";
                //echo "unsupported content type: $content_type\n";
                break;
        }
        $this->parameters = $parameters;
    }
}
?>