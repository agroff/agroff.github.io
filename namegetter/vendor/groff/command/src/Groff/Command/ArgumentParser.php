<?php
/**
 * Created by PhpStorm.
 * User: andy
 * Date: 12/12/13
 * Time: 5:51 PM
 */

namespace Groff\Command;


class ArgumentParser
{

    private $scriptName;
    private $options;
    private $arguments;

    public function parseInput($flatOptions)
    {
        //remove the first entry
        $firstArgument = array_shift($flatOptions);
        $this->parseScriptName($firstArgument);

        $parsed         = array();
        $currentOption  = false;
        $optionsStarted = false;

        foreach ($flatOptions as $option) {
            if (preg_match('/^[-][-]?/', $option)) {
                $optionsStarted         = true;
                $currentOption          = preg_replace("/^[-][-]?/", "", $option);
                $parsed[$currentOption] = true;
                continue;
            }

            if (!$optionsStarted) {
                $this->arguments[] = $option;
                continue;
            }

            if (is_bool($parsed[$currentOption])) {
                $parsed[$currentOption] = $option;
                continue;
            }

            if (!is_array($parsed[$currentOption])) {
                $parsed[$currentOption] = array($parsed[$currentOption]);
            }
            $parsed[$currentOption][] = $option;
        }

        $this->options = $parsed;

        return $parsed;
    }


    private function parseScriptName($firstArgument)
    {
        $pieces           = explode(DIRECTORY_SEPARATOR, $firstArgument);
        $this->scriptName = array_pop($pieces);
    }

    public function getScriptName()
    {
        return $this->scriptName;
    }

    public function getArgument($index = 0)
    {
        return $this->arguments[$index];
    }

    public function getArguments()
    {
        return $this->arguments;
    }

    public function getOption($index)
    {
        return $this->options[$index];
    }

    public function getOptions()
    {
        return $this->options;
    }

} 