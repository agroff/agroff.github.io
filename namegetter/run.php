#!/usr/bin/env php
<?php


$_SERVER["DOCUMENT_ROOT"] = __DIR__;


include("vendor/autoload.php");
include("fetchDogNames.php");


$command = new NameFetcher();
$status = $command->run();

exit($status);