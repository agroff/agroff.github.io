<?php namespace Groff\Command\Observe;


abstract class OutputListener implements ListenerInterface
{

    public function update(EventInterface $event)
    {
        $name = $event->getName();
        $data = $event->getEventData();
        switch($name)
        {
            case "constructed":
                $this->start($data);
                break;
            case "output":
                $this->output($data);
                break;
            case "shutdown":
                $this->end($data);
                break;
        }
    }


    protected abstract function output($data);
    protected abstract function start($data);
    protected abstract function end($data);
}