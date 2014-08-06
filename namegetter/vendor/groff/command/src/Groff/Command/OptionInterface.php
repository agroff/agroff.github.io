<?php
/**
 * Created by PhpStorm.
 * User: andy
 * Date: 12/12/13
 * Time: 6:52 PM
 */

namespace Groff\Command;


interface OptionInterface
{

    public function matches($query);

    public function setValue($value);

    public function getValue();

    public function getDescription();

    public function getPrintable();

} 