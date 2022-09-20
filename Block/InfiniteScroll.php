<?php

declare(strict_types=1);

namespace Codegenixuk\InfiniteScroll\Block;

class InfiniteScroll extends \Magento\Framework\View\Element\Template
{
    protected \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig;

    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig,
        array $data = []
    ) {
        $this->scopeConfig = $scopeConfig;
        parent::__construct($context, $data);
    }

    public function isEnabled()
    {
        return $this->scopeConfig->getValue(
            'codegenixuk_infinite_scroll/cg_is_config/enable',
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );
    }

    public function isAutoLoad()
    {
        return (boolean) $this->scopeConfig->getValue(
            'codegenixuk_infinite_scroll/cg_is_config/autoLoad',
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );
    }

    public function getPrevButtonText()
    {
        $text = $this->scopeConfig->getValue(
            'codegenixuk_infinite_scroll/cg_is_config/PrevButtonText',
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );

        if (!$text) {
            return __('Load previous page');
        }

        return $text;
    }

    public function getNextButtonText()
    {
        $text = $this->scopeConfig->getValue(
            'codegenixuk_infinite_scroll/cg_is_config/NextButtonText',
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );

        if (!$text) {
            return __('Load next page');
        }

        return $text;
    }
}
