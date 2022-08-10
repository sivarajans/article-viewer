import axios from 'axios';
import { useState, useEffect, useMemo } from 'react';

export function useThumbnail(url: string) {
    const [thumbnail, setThumbnail] = useState('');

    useEffect(() => {
        if (url == undefined || url == '') {
            return;
        }
        else {
            axios.get(url).then(respnose => {
                let html = respnose.data;
                if (html) {

                    let img = searchImage(html, [['meta', 'content'], ['img', 'src'], ['img', 'srcset']]);

                    setThumbnail(img ?? '');
                }
            }).catch(e => {
                // ignoring error
                // unable to fetch image from meta
                console.warn('unable to find any image', e);
            });
        }
    }, [])


    function searchImage(html: string, hint: [query: string, attr: string][]): string | undefined {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, "text/html");
        for (let [tag, attr] of hint) {
            var metas = doc.getElementsByTagName(tag);
            if (metas != undefined)
                for (let meta of metas) {
                    let cont = meta[attr];
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