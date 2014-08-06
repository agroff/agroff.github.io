<?php namespace Groff\Command\Observe;


interface ListenerInterface{
    public function update(EventInterface $event);
} 