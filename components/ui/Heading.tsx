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

const Heading = ({ children, as }: { children: ReactNode; as: Headings }) => {
    // useEffect(() => {}, [third]);

    return as === Headings.H1 ? (
        <h1 className='text-7xl font-semibold'> {children}</h1>
    ) : as === Headings.H2 ? (
        <h2 className='text-6xl font-semibold'>{children}</h2>
    ) : as === Headings.H3 ? (
        <h3 className='text-5xl font-medium'>{children}</h3>
    ) : as === Headings.H4 ? (
        <h4 className='text-4xl font-medium text-center'>{children}</h4>
    ) : null;
};

export default Heading;
