<?php namespace Groff\Command;


class Option implements OptionInterface
{

    private $label;
    private $description;
    private $default;
    private $alias;

    private $value;

    private $printable;

    public function __construct($label, $default, $description, $alias = false)
    {
        $this->label       = $label;
        $this->default     = $default;
        $this->value       = $default;
        $this->description = $description;
        $this->alias       = $alias;

        $this->generatePrintable();
    }

    private function generatePrintable()
    {
        $this->printable = "-" . $this->label;
        if ($this->alias !== false) {
            $this->printable .= "|--" . $this->alias;
        }

        $this->printable .= " ";
    }

    public function getPrintable()
    {
        return $this->printable;
    }

    public function matches($query)
    {
        if ($this->label === $query) {
            return true;
        }
        if ($this->alias === $query) {
            return true;
        }

        return false;
    }

    public function getLabel()
    {
        return $this->label();
    }

    public function setValue($value)
    {
        $this->value = $value;
    }

    public function getValue()
    {
        return $this->value;
    }

    public function getDescription()
    {
        return $this->description;
    }
} 