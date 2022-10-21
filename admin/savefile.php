<?php
    $json = $_POST['json'];
    if (json_decode($json) != null){
        if($_POST['publish']){
            $file = fopen('../data/data.json','w+');
            $res = fwrite($file, $json);
            fclose($file);
        }
        $file = fopen('../data/tempdata.json','w+');
        $res = fwrite($file, $json);
        fclose($file);
   }
?>
