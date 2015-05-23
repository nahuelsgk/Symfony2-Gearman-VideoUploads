<?php

namespace CH212app\BackendBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class AudioDownloadCodeType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('code')
        ;
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'CH212app\BackendBundle\Entity\AudioDownloadCode'
        ));
    }

    public function getName()
    {
        return 'ch212app_backendbundle_audiodownloadcodetype';
    }
}
