import React from "react";

const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <section className='flex justify-center py-5 w-full mt-[12rem] h-32'>
            <p className='text-sm'>
                Copyright &copy; {year} Vyacheslav Kotlyarov
            </p>
        </section>
    );
};

export default Footer;
