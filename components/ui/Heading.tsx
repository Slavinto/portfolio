import { Headings } from "@/types/enums";
import React, { ReactNode, useEffect } from "react";

// const HeadingWrapper = ({heading}:{heading: Headings}) => {
// props.as === Headings.H1
//     ? css`
//           font-size: 3rem;
//           font-weight: 600;
//       `
//     : props.as === Headings.H2
//     ? css`
//           font-size: 2rem;
//           font-weight: 600;
//       `
//     : props.as === Headings.H3
//     ? css`
//           font-size: 2rem;
//           font-weight: 500;
//       `
//     : props.as === Headings.H4
//     ? css`
//           font-size: 3rem;
//           font-weight: 600;
//           text-align: center;

// return heading === Headings.H1 ? <h1 className="">{children}</h1>

// }

const Heading = ({
    children,
    as,
    classNames = "",
}: {
    children: ReactNode;
    as: Headings;
    classNames?: string;
}) => {
    return as === Headings.H1 ? (
        <h1
            className={`text-2xl md:text-3xl lg:text-5xl xl:text-7xl font-semibold ${classNames}`}
        >
            {" "}
            {children}
        </h1>
    ) : as === Headings.H2 ? (
        <h2
            className={`text-lg md:text-2xl lg:text-4xl xl:text-6xl font-semibold ${classNames}`}
        >
            {children}
        </h2>
    ) : as === Headings.H3 ? (
        <h3
            className={`text-md md:text-xl lg:text-3xl xl:text-5xl font-medium ${classNames}`}
        >
            {children}
        </h3>
    ) : as === Headings.H4 ? (
        <h4
            className={`text-sm md:text-lg lg:text-2xl xl:text-4xl font-medium text-center ${classNames}`}
        >
            {children}
        </h4>
    ) : null;
};

export default Heading;
