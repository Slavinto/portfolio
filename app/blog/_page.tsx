import React from "react";

const BlogPage = () => {
    return (
        <section className='w-full h-screen flex border-white-100 border '>
            <div className='blog-header -z-1'>
                <div
                    className='w-full h-full dark:opacity-[60%] opacity-100 bg-cover bg-bottom bg-no-repeat z-0'
                    style={{ backgroundImage: "url('/images/cat-blog.jpg')" }}
                ></div>
                <h1 className='w-[70%] center-absolute text-center text-white-300 text-stroke drop-shadow-md font-extrabold text-5xl lg:text-6xl xl:text-7xl tracking-wider z-10'>
                    Slava&apos;s Blog Main Page
                </h1>
            </div>
            <article className='w-full px-5 md:px-10 lg:px-20 pt-[45vh]'>
                <p className='text-sm dark:font-extralight font-light md:text-lg tracking-wider'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quasi debitis maxime similique, nobis dolorem delectus
                    quidem. Iste, vel voluptatem? Similique sequi unde illo. Ut
                    doloribus alias, pariatur saepe cum eos reiciendis officia,
                    dignissimos cupiditate molestiae consequuntur? Ullam sunt
                    non qui, consequuntur alias totam unde error in tempora
                    quidem soluta sequi eaque eius minus debitis dolorem magnam
                    facilis aliquid blanditiis doloribus facere amet maxime rem
                    quo. Nulla, molestias deleniti. Alias eos quam fugiat, a
                    ullam error facere quisquam inventore magnam vitae sunt
                    voluptates. Quis, eum quaerat reiciendis quos corporis
                    molestias perspiciatis, incidunt hic iste, at modi quibusdam
                    voluptatibus quae amet vitae!
                </p>
                <br />
                <p className='text-sm dark:font-extralight font-light md:text-lg tracking-wider'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quasi debitis maxime similique, nobis dolorem delectus
                    quidem. Iste, vel voluptatem? Similique sequi unde illo. Ut
                    doloribus alias, pariatur saepe cum eos reiciendis officia,
                    dignissimos cupiditate molestiae consequuntur? Ullam sunt
                    non qui, consequuntur alias totam unde error in tempora
                    quidem soluta sequi eaque eius minus debitis dolorem magnam
                    facilis aliquid blanditiis doloribus facere amet maxime rem
                    quo. Nulla, molestias deleniti. Alias eos quam fugiat, a
                    ullam error facere quisquam inventore magnam vitae sunt
                    voluptates. Quis, eum quaerat reiciendis quos corporis
                    molestias perspiciatis, incidunt hic iste, at modi quibusdam
                    voluptatibus quae amet vitae!
                </p>
            </article>
        </section>
    );
};

export default BlogPage;
