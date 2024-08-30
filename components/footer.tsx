import React from "react";

const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <div className='flex justify-center py-5 w-full'>
            <p className='text-sm'>
                Copyright &copy; {year} Vyacheslav Kotlyarov
            </p>
        </div>
    );
};

export default Footer;
