<?php namespace Groff\Command\Observe;

interface EventInterface
{
    public function notify($name, $data = array());
    public function attach(ListenerInterface $listener);
    public function detach(ListenerInterface $listener);

    public function getName();
    public function getEventData();
}