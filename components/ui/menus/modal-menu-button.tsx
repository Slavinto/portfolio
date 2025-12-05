export const ModalMenuButton = () => {
    return (
        <div className='fixed z-50 lg:top-20 lg:right-4 top-4 right-20'>
            <div className='dark:bg-background bg-white dark:border-white/[0.2] flex justify-center relative rounded-xl menu-container'>
                <div
                    style={{
                        top: "0rem",
                        right: "0rem",
                    }}
                    className='dark:hover:border-neutral-500 hover:border-neutral-200 span-wrapper absolute dark:btn-gradient btn-gradient-light border-neutral-100 border-2 dark:border-white/[0.2] w-12 h-12 rounded-lg
                    flex items-center justify-center cursor-pointer'
                >
                    <div className='span-container linear-mask w-full h-full flex flex-col items-end relative p-2'>
                        <span
                            style={{
                                width: "1.8rem",
                                height: "5%",
                                top: "0.75rem",
                                left: "0.5rem",
                            }}
                            className='span-item s-item-1 dark:bg-white-300 bg-black-200 absolute'
                        ></span>
                        <span
                            style={{
                                width: "1.8rem",
                                height: "5%",
                                top: "1.25rem",
                                left: "0.5rem",
                            }}
                            className='span-item s-item-2 dark:bg-white-300 bg-black-200 absolute'
                        ></span>
                        <span
                            style={{
                                width: "0.9rem",
                                height: "5%",
                                top: "1.75rem",
                                right: "0.5rem",
                            }}
                            className='span-item s-item-3 dark:bg-white-300 bg-black-200 absolute'
                        ></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalMenuButton;
