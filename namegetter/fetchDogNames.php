<?php


class NameFetcher extends \Groff\Command\Command
{
    protected $description = "Gets names";

    /**
     * Contains the main body of the command
     *
     * @return Int Status code - 0 for success
     */
    function main()
    {

        $url = "http://pubapi.cryptsy.com/api.php?method=singlemarketdata&marketid=169";


        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

        $resp = curl_exec($curl);

        curl_close($curl);



        $array = json_decode($resp,true);
        $trades = $array["return"]["markets"]["RDD"]["recenttrades"];

        print_r($array["return"]["markets"]["RDD"]);

        foreach($trades as $order)
        {
            echo $order["price"]."\n";
            echo $order["quantity"]."\n";
            echo $order["total"]."\n";
        }
        return;



        $gender = "female";
        $alphabet = array(
            "A", "B", "C", "D", "E", "F", "G", "H", "I",
            "J", "K", "L", "M", "N", "O", "P", "Q", "R",
            "S", "T", "U", "V", "W", "X", "Y", "Z"
        );
        $alphabet = array( "A", "B", "C", "D" );
        //$alphabet = array( "T" );
        $completeList = array();


        foreach ($alphabet as $letter) {

            $this->out("Fetching letter `$letter` ");

            $url = $this->letterToUrl($letter, $gender);
            $html = $this->fetch($url);
            $names = $this->htmlToNameArray($html);

            $completeList = array_merge($completeList, $names);

            $this->out("Sleeping 4 seconds.");

            sleep(6);
        }

        $this->out("Finished!");
        $this->out("Complete List:");
        $this->out("-----------------------");
        $this->out(implode(", ", $completeList));

        $result = json_encode(
            array(
                $gender . "_dog_names" => $completeList
            ),
            JSON_PRETTY_PRINT
        );

        file_put_contents($gender . "_dog_names.json", $result);


        return 0;
    }

    private function htmlToNameArray($html){
        $pattern = '/Names beginning with(.+?)\/table>/ms';
        preg_match($pattern, $html, $matches);
        $table = $matches[1];

        $pattern = '/td[^>]+><strong>(.+?) ?<\/strong>/ms';
        preg_match_all($pattern, $table, $matches);

        $this->out("Matches Found:");
        $this->out(implode(", ", $matches[1]));

        return $matches[1];
    }

    private function letterToUrl($letter, $gender){
        $urlPattern = "http://www.momswhothink.com/$gender-dog-names/$gender-dog-names-{letter}.html";

        $letter = strtolower($letter);

        return str_replace('{letter}', $letter, $urlPattern);
    }

    private function fetch($url){
        $this->out("Fetching Source From: " . $url);
        return file_get_contents($url);
    }


    private function out($string){
        echo $string . "\n";
    }

    protected function printUsage($scriptName)
    {
        echo "Usage: $scriptName install  \n";
    }

    protected function addOptions()
    {
        //$this->addOption(new Option("v", FALSE, "Write output.", "verbose"));
        //$this->addOption(new Option("f", FALSE, "Force an update regardless of the time.", "force"));
    }
}