<?php namespace Groff\Command;

use Groff\Command\Exception\InvalidFilePathException;

/**
 * Project: problems
 * Author:  andy
 * Created: 12/13/13 7:32 PM
 */
class FileWriter
{

    private $filePath = null;

    public function __construct($filePath = null)
    {
        if (!is_null($filePath)) {
            $this->filePath = $filePath;
        }
    }

    public function write($contents)
    {
        if(is_null($this->filePath))
        {
            throw new InvalidFilePathException("File path not set");
        }

        if(file_exists($this->filePath))
        {
            $checkPath = $this->filePath;
        }
        else
        {
            $checkPath = dirname($this->filePath);
        }

        if(!is_writable($checkPath))
        {
            throw new InvalidFilePathException("The file path `{$this->filePath}` is not writable");
        }

        file_put_contents($this->filePath, $contents);
    }

    public function setFilePath($path)
    {
        $this->filePath = $path;
    }

} 