<?php namespace Groff\Command\Observe;


class EventHost implements EventInterface
{

    /** @var ListenerInterface[] */
    private $observers = array();

    private $name;
    private $eventData;

    public function notify($name, $data = array())
    {
        $this->setName($name);
        $this->setEventData($data);

        foreach ($this->observers as $observer) {
            $observer->update($this);
        }
    }

    public function attach(ListenerInterface $listener)
    {
        $this->observers[] = $listener;
    }

    public function detach(ListenerInterface $listener)
    {
        foreach ($this->observers as $key => $currentObserver) {
            if ($currentObserver === $listener) {
                unset($this->observers[$key]);
            }
        }
    }

    private function setName($name)
    {
        $this->name = $name;
    }

    public function getName()
    {
        return $this->name;
    }

    private function setEventData($data)
    {
        $this->eventData = $data;
    }

    public function getEventData()
    {
        return $this->eventData;
    }

} 