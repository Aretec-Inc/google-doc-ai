import React, { useState } from 'react';
import { Table, Tabs } from 'antd';
import { X } from 'lucide-react';
import PropTypes from 'prop-types';

const BusinessRulesDrawer = ({
    isOpen,
    rules,
    loading,
    setIsDrawerOpen,
    highlights,
    selectedHighLights,
    setSelectedHighLights,
    setShouldScrollPDF,
    setShouldScrollSidebar,
    activeTab,
    setActiveTab,
}) => {
    if (!isOpen) return null;

    const items = [
        {
            key: '1',
            label: 'Business Rules',
            children: <BusinessRulesTable rules={rules} loading={loading} />,
        },
        {
            key: '2',
            label: 'HITL',
            children: (
                <HITLNavigator
                    highlights={highlights}
                    selectedHighLights={selectedHighLights}
                    setSelectedHighLights={setSelectedHighLights}
                    setShouldScrollPDF={setShouldScrollPDF}
                    setShouldScrollSidebar={setShouldScrollSidebar}
                />
            ),
        },
    ];

    return (
        <div className="absolute right-0 top-0 bottom-0 w-4/12 bg-white border-l border-gray-200 overflow-hidden">
            <div className="sticky top-0 border-b border-gray-200 bg-white flex justify-between items-center p-4">
                <h2 className="text-lg font-semibold">Results</h2>
                <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                >
                    <X size={20} className="text-gray-600" />
                </button>
            </div>
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={items}
                className="px-4"
            />
        </div>
    );
};

BusinessRulesDrawer.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    rules: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    setIsDrawerOpen: PropTypes.func.isRequired,
    highlights: PropTypes.array.isRequired,
    selectedHighLights: PropTypes.array.isRequired,
    setSelectedHighLights: PropTypes.func.isRequired,
    setShouldScrollPDF: PropTypes.func.isRequired,
    setShouldScrollSidebar: PropTypes.func.isRequired,
    activeTab: PropTypes.string.isRequired,
    setActiveTab: PropTypes.func.isRequired,
};

export default 