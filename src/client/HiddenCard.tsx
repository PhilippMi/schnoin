import "./hidden-card.scss";

import React from "react";

interface HiddenCardProps {
    rotated?: boolean
}

export function HiddenCard(props: HiddenCardProps) {
    return <div role="image" className={`hidden-card ${props.rotated ? 'hidden-card--rotated' : ''}`}/>
}
