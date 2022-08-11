import axios from 'axios';
import { useState, useEffect, useMemo, useRef } from 'react';

export default function useThumbnail(nail: string, url: string, isAlreadyTaken: boolean) {
    const [thumbnail, setThumbnail] = useState('');
    const isNailParsed = useRef(false);

    useEffect(() => {
        if (url == undefined || url == '' || nail != undefined || isAlreadyTaken) {
            setThumbnail(nail);
        }
        else {
            if (!isNailParsed.current) {
                isNailParsed.current = true;
                axios.get(url).then(respnose => {
                    let html = respnose.data;
                    if (html) {
                        let img = searchImage(html, [['meta', 'content'], ['img', 'src'], ['img', 'srcset']]);
                        setThumbnail(img ?? '');
                    }
                }).catch(e => {
                    // ignoring error
                    // unable to get image url
                    console.warn('unable to find any image', e);
                });
            }
        }
    }, [url])


    function searchImage(html: string, hint: [query: string, attr: string][]): string | undefined {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, "text/html");
        for (let [tag, attr] of hint) {
            var metas = doc.getElementsByTagName(tag);
            if (metas != undefined)
                for (let i = 0; i < metas.length; i++) {
                    let cont = metas[i].getAttribute(attr);
                    if (cont != undefined) {
                        let match = cont.match(/^http[s].+\.(jpg|jpeg|png|gif|apng|avif|svg|webp)$/gi);
                        if (match) {
                            return match[0];
                        }
                    }
                }
        }
        return undefined;
    }


    return thumbnail;
}