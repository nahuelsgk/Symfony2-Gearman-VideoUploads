<?php
namespace CH212app\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;


/**
 * Store
 * 
 * @ORM\Entity
 * @ORM\Table(name="store")
 */
class Store{
	
	/**
	 * @ORM\Column(name="id", type="integer")
	 * @ORM\Id
	 * @ORM\GeneratedValue(strategy="AUTO")
	 *
	 * @var integer
	 */
	private $id;
	
	/**
	 * @ORM\Column(type="string", length=255, nullable=false)
	 */
	private $name;
	
	/**
	 * @ORM\Column(type="string", length=255, nullable=false)
	 */
	private $zipcode;
	
	/**
	 * @ORM\Column(type="string", length=10, nullable=false)
	 */
	private $country;
	
	/**
	 * @ORM\Column(type="string", length=255, nullable=false)
	 */
	private $address;
	
	/**
	 * @ORM\Column(type="boolean")
	 */
	private $active;
	
	/**
	 * @ORM\Column(type="float", nullable=true)
	 */
	private $longitud;
	
	/**
	 * @ORM\Column(type="float", nullable=true)
	 */
	private $latitude;
	
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
     * Set zipcode
     *
     * @param string $zipcode
     * @return Store
     */
    public function setZipcode($zipcode)
    {
        $this->zipcode = $zipcode;

        return $this;
    }

    /**
     * Get zipcode
     *
     * @return string 
     */
    public function getZipcode()
    {
        return $this->zipcode;
    }

    /**
     * Set country
     *
     * @param string $country
     * @return Store
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
     * Set address
     *
     * @param string $address
     * @return Store
     */
    public function setAddress($address)
    {
        $this->address = $address;

        return $this;
    }

    /**
     * Get address
     *
     * @return string 
     */
    public function getAddress()
    {
        return $this->address;
    }

    /**
     * Set active
     *
     * @param boolean $active
     * @return Store
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
     * Set longitud
     *
     * @param float $longitud
     * @return Store
     */
    public function setLongitud($longitud)
    {
        $this->longitud = $longitud;

        return $this;
    }

    /**
     * Get longitud
     *
     * @return float 
     */
    public function getLongitud()
    {
        return $this->longitud;
    }

    /**
     * Set latitude
     *
     * @param float $latitude
     * @return Store
     */
    public function setLatitude($latitude)
    {
        $this->latitude = $latitude;

        return $this;
    }

    /**
     * Get latitude
     *
     * @return float 
     */
    public function getLatitude()
    {
        return $this->latitude;
    }

    /**
     * Set name
     *
     * @param string $name
     * @return Store
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string 
     */
    public function getName()
    {
        return $this->name;
    }
    
}
