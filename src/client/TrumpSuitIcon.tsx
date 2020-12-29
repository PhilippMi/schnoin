import './trump-suit-icon.scss';
import React from "react";
import {Suit} from "../shared/Card";
// @ts-ignore
import acornsIcon from "../../assets/eichel.svg";
// @ts-ignore
import bellsIcon from "../../assets/schellen.svg";
// @ts-ignore
import heartsIcon from "../../assets/herz.svg";
// @ts-ignore
import leavesIcon from "../../assets/laub.svg";

interface TrumpSuitIconProps {
    trumpSuit: Suit
}

export function TrumpSuitIcon(props: TrumpSuitIconProps) {
    const suitMap: Record<Suit, {imgSrc: string; altText: string}> = {
        [Suit.Acorns]: {
            imgSrc: acornsIcon,
            altText: 'Eichel'
        },
        [Suit.Bells]: {
            imgSrc: bellsIcon,
            altText: 'Schellen'
        },
        [Suit.Hearts]: {
            imgSrc: heartsIcon,
            altText: 'Herz'
        },
        [Suit.Leaves]: {
            imgSrc: leavesIcon,
            altText: 'Laub'
        }
    }
    const {imgSrc, altText} = suitMap[props.trumpSuit]
    return <img src={imgSrc} alt={altText} className='trump-suit-icon'/>
}
