<?php

/**
tester
 * Project: command
 * Author:  andy
 * Created: 12/17/13 5:29 AM
 */
class ArgumentParserTest extends PHPUnit_Framework_TestCase
{

    /** @var  \Groff\Command\ArgumentParser */
    private $parser;

    public function setUp()
    {
        $this->parser = new Groff\Command\ArgumentParser();
    }

    public function testParsesManyOptions()
    {
        //php automatically populates $argv with an array like this one
        $opts = [
            '../unfair-wager-436/UnfairWager',
            '-h',
            '-test',
            'one argument',
            '-another',
            'one',
            'two',
            '--finally',
            'just one',
        ];

        $expected = [
            "h"       => true,
            "test"    => "one argument",
            "another" => ["one", "two"],
            "finally" => "just one"
        ];


        $this->parser->parseInput($opts);

        $this->assertEquals($this->parser->getOption("h"), true, "verify option h set");
        $this->assertEquals($this->parser->getOption("test"), "one argument", "verify option gets value with spaces");
        $this->assertEquals(
            $this->parser->getOption("another"),
            ["one", "two"],
            "verify multiple option arguments become array"
        );
        $this->assertEquals(
            $this->parser->getOption("finally"),
            "just one",
            "verify everything stillworks after handling several different cases"
        );
    }

    public function testParsesSingleBoolean()
    {
        $opts = [
            '../unfair-wager-436/UnfairWager',
            '-h'
        ];

        $this->parser->parseInput($opts);

        $this->assertEquals($this->parser->getOption("h"), true, "verify boolean works by itself");
    }

    public function testParsesArguments()
    {
        $opts = [
            '../unfair-wager-436/UnfairWager',
            'firstArgument',
            'second_argument'
        ];

        $this->parser->parseInput($opts);

        $this->assertEquals($this->parser->getArgument(0), "firstArgument", "get first argument");
        $this->assertEquals($this->parser->getArgument(1), "second_argument", "get second argument");
    }

    public function testParsesScriptArgumentsAndOptions()
    {
        $opts = [
            '../unfair-wager-436/UnfairWager',
            'firstArgument',
            'second_argument',
            '-h',
            '--longOption',
            'long'
        ];

        $this->parser->parseInput($opts);

        $this->assertEquals($this->parser->getScriptName(), "UnfairWager", "get script");
        $this->assertEquals($this->parser->getArgument(0), "firstArgument", "get first argument");
        $this->assertEquals($this->parser->getArgument(1), "second_argument", "get second argument");
        $this->assertEquals($this->parser->getOption("h"), true, "get boolean");
        $this->assertEquals($this->parser->getOption("longOption"), 'long', "get long option");
    }
}
 
