<?php namespace Groff\Command;


class OutputWriter extends Observe\OutputListener
{

    private $writer;
    private $output = '';

    public function __construct(FileWriter $writer = null)
    {
        if(is_null($writer))
        {
            $writer = new FileWriter();
        }

        $this->writer = $writer;
    }

    protected function output($data)
    {
        $this->output .= ob_get_contents();
        ob_flush();
    }

    protected function start($data)
    {
        ob_start();
    }

    protected function end($data)
    {
        $this->output($data);
        ob_end_clean();
        $this->writer->write($this->output);
    }

    public function setFilePath($path)
    {
        $this->writer->setFilePath($path);
    }
}