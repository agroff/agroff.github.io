<?php namespace Groff\Command;

use Groff\Command\Exception\ObjectDoesNotExistException;

abstract class Command
{

    /** @var \Groff\Command\ArgumentParser */
    private $parser;

    /** @var \Groff\Command\OptionCollection */
    private $options;

    /** @var \Groff\Command\EventHost */
    private $eventHost;

    /** @var \Illuminate\Database\Capsule */
    private $db;

    private $rawOptions = false;

    protected $description = "";

    /**
     * Provides default instantiation of dependencies and allows them to
     * be overridden for unit testing. Calls constructed hook for
     * implementing class and fires a notification.
     *
     * @param ArgumentParser   $parser
     * @param OptionCollection $options
     * @param EventInterface   $eventHost
     */
    public function __construct(
//                                                                                                                      @formatter:off
        ArgumentParser $parser = null,
        OptionCollection $options = null,
        EventInterface $eventHost = null
//                                                                                                                      @formatter:on
    )
    {

        if (is_null($parser)) {
            $parser = new ArgumentParser();
        }

        if (is_null($options)) {
            $options = new OptionCollection();
        }

        if (is_null($eventHost)) {
            $eventHost = new Observe\EventHost();
        }

        $this->parser    = $parser;
        $this->options   = $options;
        $this->eventHost = $eventHost;

        $this->constructed();
        $this->notify("constructed");
    }

    /**
     * Contains the main body of the command
     *
     * @return Int Status code - 0 for success
     */
    abstract function main();

    /**
     * Hook for the inheriting class to attach observers, or do whatever
     * else it would like to do in the constructor without having to
     * worry about implementing dependency injection
     *
     * @return void
     */
    protected function constructed()
    {
        //hook in inheriting class
    }

    /**
     * Hook for the inheriting class to define available options
     *
     * @return void
     */
    protected function addOptions()
    {
        //hook in inheriting class
    }

    /**
     * This is an instance of the template method pattern. It runs the entire Cli Command
     * but leaves the `main` method abstract to ensure it is implemented in the
     * subclass. An optional addOptions hook is also provided here.
     *
     * @return int Status code. 0 for success, other values indicate an error.
     */
    final public function run()
    {
        $this->notify("run");

        $this->addOptions();

        $this->notify("options added");

        $this->populateOptions();

        $this->addHelpCommand();

        $this->populateOptions();

        $this->notify("options available");

        if ($this->option("help")) {
            return $this->printHelp();
        }

        $this->notify("pre main");

        try {
            $status = $this->main();
        } catch (\Exception $e) {
            $status = $this->catchMainException($e);
        }

        $this->notify("shutdown");

        return $status;
    }

    private function catchMainException($e)
    {
        echo "An Error Occured \n";
        echo "    " . $e->getMessage();
        echo "\n";
        $this->notify("output");
        return 1;
    }

    protected function addHelpCommand()
    {
        $this->addOption(new Option("h", false, "Prints this usage information.", "help"));
    }

    /**
     * A Facade of OptionCollection. Declared final to make sure it
     * behaves as expected, since its used in the run method above.
     *
     * @param OptionInterface $option
     */
    final protected function addOption(OptionInterface $option)
    {
        $this->options->add($option);
    }

    /**
     * Returns an option's value. Facade of OptionCollection.
     *
     * @param $query string An option's name or alias
     *
     * @return mixed
     */
    final public function option($query)
    {
        try {
            $option = $this->options->find($query);
            $value  = $option->getValue();

        } catch (ObjectDoesNotExistException $e) {
            $value = false;
        }

        return $value;
    }

    final public function argument($index)
    {
        return $this->parser->getArgument($index);
    }

    final public function setDb($db)
    {
        $this->db = $db;
    }

    final public function db()
    {
        return $this->db;
    }

    /**
     * Sends an event to any registered listeners.
     *
     * @param       $name
     * @param array $data
     */
    final public function notify($name, $data = array())
    {
        $this->eventHost->notify($name, $data);
    }

    /**
     * Attaches an event listener
     *
     * @param Observe\ListenerInterface $observer
     */
    final public function attach(Observe\ListenerInterface $observer)
    {
        $this->eventHost->attach($observer);
    }

    /**
     * Detaches an event listener
     *
     * @param Observe\ListenerInterface $observer
     */
    final public function detach(Observe\ListenerInterface $observer)
    {
        $this->eventHost->detach($observer);
    }

    /**
     * Provides CLI arguments. Abstracted since it uses an ugly global variable.
     * Also allows a subclass to provide its own options.
     *
     * @return array
     */
    protected function getRawOptions()
    {
        global $argv;

        if (!is_array($this->rawOptions)) {
            $this->setRawOptions($argv);
        }

        return $this->rawOptions;
    }

    protected function setRawOptions($rawOptions)
    {
        $this->rawOptions = $rawOptions;
    }

    /**
     * Gets parsed options and uses them to populate options in the options collection
     */
    private function populateOptions()
    {
        $flatOptions = $this->getRawOptions();

        $this->parser->parseInput($flatOptions);

        $parsed = $this->parser->getOptions();

        foreach ($parsed as $optionName => $optionValue) {
            //ignores any options the user sent which were not defined
            $this->options->setValueIfExists($optionName, $optionValue);
        }
    }

    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Prints help output
     *
     * @return int Status code
     */
    final protected function printHelp()
    {
        $script = $this->parser->getScriptName();

        $this->printUsage($script);

        $this->printDescription();

        /** @var $option Option */
        foreach ($this->options as $option) {
            echo " " . $option . "\n";
        }

        echo "\n";

        $this->notify("output");

        $this->notify("shutdown");

        return 0;
    }

    protected function printDescription()
    {
        if (!empty($this->description)) {
            echo "    " . $this->description;
        }
        echo "\n";
    }

    protected function printUsage($scriptName)
    {
        echo "Usage: $scriptName arguments [options] \n";
    }

} 