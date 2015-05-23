<?php
namespace CH212app\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;


/**
 * Gift
 * 
 * @ORM\Entity
 * @ORM\Table(name="gift")
 */
class Gift{
	/**
	 * @ORM\Column(name="id", type="integer")
	 * @ORM\Id
	 * @ORM\GeneratedValue(strategy="AUTO")
	 *
	 * @var integer
	 */
	private $id;
	
	/**
	 * @ORM\Column(type="string", length=10, nullable=false)
	 */
	private $country;
	
	/**
	 * @ORM\Column(type="boolean")
	 */
	private $active;
	
	/**
	 * @ORM\Column(type="string", length=255, nullable=false)
	 */
	private $gift;
	

    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set country
     *
     * @param string $country
     * @return Gift
     */
    public function setCountry($country)
    {
        $this->country = $country;

        return $this;
    }

    /**
     * Get country
     *
     * @return string 
     */
    public function getCountry()
    {
        return $this->country;
    }

    /**
     * Set active
     *
     * @param boolean $active
     * @return Gift
     */
    public function setActive($active)
    {
        $this->active = $active;

        return $this;
    }

    /**
     * Get active
     *
     * @return boolean 
     */
    public function getActive()
    {
        return $this->active;
    }

    /**
     * Set gift
     *
     * @param string $gift
     * @return Gift
     */
    public function setGift($gift)
    {
        $this->gift = $gift;

        return $this;
    }

    /**
     * Get gift
     *
     * @return string 
     */
    public function getGift()
    {
        return $this->gift;
    }
}
