<?php

$array[] = ['id'=> 1, 'text'=> "Account Management"];
$array[] = ['id'=> 2, 'text'=> "Aerospace Engineering"];
$array[] = ['id'=> 3, 'text'=> "Aerospace Industries"];
$array[] = ['id'=> 4, 'text'=> "Aerospace Manufacturing"];
$array[] = ['id'=> 5, 'text'=> "Aerospace Structures"];
$array[] = ['id'=> 6, 'text'=> "Analytics"];
$array[] = ['id'=> 7, 'text'=> "Application Architecture"];
$array[] = ['id'=> 8, 'text'=> "Applied Behavior Analysis"];
$array[] = ['id'=> 9, 'text'=> "Applied Mathematics"];
$array[] = ['id'=> 10, 'text'=> "Asset Management"];
$array[] = ['id'=> 11, 'text'=> "Asset Protection"];
$array[] = ['id'=> 12, 'text'=> "Audio Engineering"];
$array[] = ['id'=> 13, 'text'=> "Automotive Engineering"];

$array[] = ['id'=> 14, 'text'=> "Data Analysis"];
$array[] = ['id'=> 15, 'text'=> "Data Management"];
$array[] = ['id'=> 16, 'text'=> "Data Migration"];
$array[] = ['id'=> 17, 'text'=> "Data Mining"];
$array[] = ['id'=> 18, 'text'=> "Data Modeling"];
$array[] = ['id'=> 19, 'text'=> "Data Quality"];
$array[] = ['id'=> 20, 'text'=> "Digital Strategy"];

function startsWith ($string, $startString)
{
    $len = strlen($startString);
    return (substr($string, 0, $len) === $startString);
}

function findInArray($str, $arr) {
    $match = [];
    foreach ($arr as $key => $value) {
        if(startsWith( strtolower($value['text']), $str)){
            $match[] = $value;
        }
    }
    return $match;
}
$return = findInArray($_GET['term'], $array);
// print_r($return);



echo json_encode($return);
exit();
?>