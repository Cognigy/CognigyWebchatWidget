import React, { memo, useCallback} from 'react';

import { FC, useEffect, useRef } from "react";
import { Action, AdaptiveCard as MSAdaptiveCard, HostConfig } from 'adaptivecards';
import { Remarkable } from 'remarkable';
import { sanitizeHTML } from '../../../webchat/helper/sanitize';

interface IAdaptiveCardProps {
    hostConfig?: Partial<HostConfig>;
    onExecuteAction?: (actionJson: any) => void;
    setCardOffsetTop?: (offsetTop: number) => void;
    payload?: boolean;
}

// it's designed to be used as a signleton instance, following their documentation
const md = new Remarkable();
// enables abbrevations
// https://michelf.ca/projects/php-markdown/extra/#abbr
md.core.ruler.enable(['abbr']);

/**
 * Manually add Support for rending Markdown, as described here:
 * https://www.npmjs.com/package/adaptivecards#user-content-option-2-any-other-3rd-party-library
 * 
 * We went for "remarkable" over the suggested "markdown-it", because
 * - it has a smaller footprint
 * - it supports all standard features
 * - we already do have our own "sanitizing" approach which we can reuse here
 */
MSAdaptiveCard.onProcessMarkdown = (text, result) => {
    const html = md.render(text);
    const saneHtml = sanitizeHTML(html);

    result.outputHtml = saneHtml;
    result.didProcess = true;
}

/**
 * Inspired by Microsoft's (not publically released) adaptivecards-react package
 * https://github.com/microsoft/AdaptiveCards/blob/5b66a52e0e0cee5074a42dcbe688d608e0327ae4/source/nodejs/adaptivecards-react/src/adaptive-card.tsx
 */
const AdaptiveCard: FC<IAdaptiveCardProps> = (props) => {
    const { payload, hostConfig, onExecuteAction, setCardOffsetTop } = props;

    const targetRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<MSAdaptiveCard>(
        new MSAdaptiveCard()
    );
    const executeAction = useCallback(
        (a: Action) => {
            onExecuteAction?.(a);
        },
        [onExecuteAction]
    );

    useEffect(() => {
        cardRef.current.onExecuteAction = executeAction;
    }, [executeAction]);

    useEffect(() => {
        cardRef.current.hostConfig = new HostConfig(hostConfig);
    }, [hostConfig]);

    useEffect(() => {
        if (!targetRef.current) {
            return;
        }
        const card = cardRef.current;

        try {
            card.parse(payload);
            const result = card.render() as HTMLElement;
            targetRef.current.innerHTML = '';
            targetRef.current.appendChild(result);
            setCardOffsetTop && setCardOffsetTop(targetRef.current.offsetTop);
        } catch (cardRenderError) {
            console.error('Unable to render Card', cardRenderError);
        }
    }, [hostConfig, payload]);

    return (
        <div ref={targetRef} />
    );
}

export default memo(AdaptiveCard);