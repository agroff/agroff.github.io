<?php
/**
 * Created by PhpStorm.
 * User: andy
 * Date: 12/12/13
 * Time: 6:56 PM
 */

namespace Groff\Command;


use Groff\Command\Exception\ObjectDoesNotExistException;

class OptionCollection implements \Iterator
{

    /** @var OptionInterface[] */
    private $options = array();
    private $position = 0;
    private $longestLength = 0;

    public function __construct()
    {
        $this->position = 0;
    }

    public function add(OptionInterface $option)
    {
        $this->options[] = $option;
        $printable       = $option->getPrintable();
        $length          = strlen($printable);

        if ($length > $this->longestLength) {
            $this->longestLength = $length;
        }
    }

    public function remove($query)
    {
        $key = $this->findKey($query);
        unset($this->options[$key]);
    }

    /**
     * @param $query String - the command name or alias
     *
     * @return OptionInterface;
     */
    public function find($query)
    {
        $key = $this->findKey($query);

        return $this->options[$key];
    }

    public function setValueIfExists($query, $value)
    {
        try {
            $key = $this->findKey($query);
            $this->options[$key]->setValue($value);

            return true;
        } catch (ObjectDoesNotExistException $e) {
            return false;
        }
    }

    private function findKey($query)
    {
        foreach ($this->options as $key => $option) {
            if ($option->matches($query)) {
                return $key;
            }
        }

        throw new ObjectDoesNotExistException("Option `$query` was not found");
    }

    private function toString(OptionInterface $option)
    {
        $printable = $option->getPrintable();
        $padding   = str_repeat(" ", $this->longestLength - strlen($printable));
        return " " . $printable . $padding . " " . $option->getDescription();
    }

    /**
     * (PHP 5 &gt;= 5.0.0)<br/>
     * Return the current element
     * @link http://php.net/manual/en/iterator.current.php
     * @return mixed Can return any type.
     */
    public function current()
    {
        return $this->toString($this->options[$this->position]);
    }

    /**
     * (PHP 5 &gt;= 5.0.0)<br/>
     * Move forward to next element
     * @link http://php.net/manual/en/iterator.next.php
     * @return void Any returned value is ignored.
     */
    public function next()
    {
        $this->position += 1;
    }

    /**
     * (PHP 5 &gt;= 5.0.0)<br/>
     * Return the key of the current element
     * @link http://php.net/manual/en/iterator.key.php
     * @return mixed scalar on success, or null on failure.
     */
    public function key()
    {
        if ($this->valid()) {
            return $this->options[$this->position]->getLabel();
        }
    }

    /**
     * (PHP 5 &gt;= 5.0.0)<br/>
     * Checks if current position is valid
     * @link http://php.net/manual/en/iterator.valid.php
     * @return boolean The return value will be casted to boolean and then evaluated.
     * Returns true on success or false on failure.
     */
    public function valid()
    {
        return isset($this->options[$this->position]);
    }

    /**
     * (PHP 5 &gt;= 5.0.0)<br/>
     * Rewind the Iterator to the first element
     * @link http://php.net/manual/en/iterator.rewind.php
     * @return void Any returned value is ignored.
     */
    public function rewind()
    {
        $this->position = 0;
    }
}