import { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { client, getIntersectInstance, getLocalArticles } from '../common';
import styles from '../styles/Article.module.css';
import { AddArticle } from './addArticle';
import { GET_ARTICLES } from './api/graphQueries';
import { SingleArticle } from './article';
import { articleType } from './types/article.type';

export default function Articles() {
    const [currentPage, setCurrentPage] = useState(0);
    const [canYeildMore, setCanYeildMore] = useState(true);
    const [articles, setArticles] = useState([] as articleType[]);
    const oberver: MutableRefObject<any> = useRef();
    
    let isLoading = true;
    let error: any;
    let isAdded = false;

    useEffect(() => {
        if (!isAdded) {
            let localArticles = getLocalArticles();
            isAdded = true;
            setArticles(prev => ([...localArticles, ...prev]))
        }
    }, [])

    // Memorizing to avoid any change to page should not call articles again.
    useMemo(() => {
        if (currentPage != null && canYeildMore) {
            client.query({ query: GET_ARTICLES, variables: { page: currentPage } }).then(result => {
                isLoading = false;
                if (result?.data?.retrievePageArticles?.length > 0) {
                    let nextPage = result?.data?.retrievePageArticles;
                    setArticles(art => ([...art, ...nextPage]))
                } else {
                    setCanYeildMore(false)
                }
            }, e => error = e)
        }
    }, [currentPage])


    const lastArticleWatchReference = useCallback((node: any) => {
        if (isLoading) return;
        focusConnect(node);

    }, [currentPage])


    function focusConnect(node: any) {
        if (oberver && oberver.current) oberver.current.disconnect();
        oberver.current = getIntersectInstance(() => {
            oberver.current.disconnect();
            if (canYeildMore) {
                setCurrentPage(page => page + 1);
            }
        });

        if (node) oberver.current.observe(node);
    }

    function refreshFromLocalStorage(article: any) {
        setArticles(prev => ([article, ...prev]))
    }

    return (
        <div>
            <AddArticle emitRefresh={refreshFromLocalStorage}></AddArticle>
            {

                articles.map((article: any, index: number) => {
                    if (index + 1 == articles.length) {
                        return <article className={styles.article} ref={lastArticleWatchReference} key={index}>
                            <SingleArticle article={article}></SingleArticle>
                        </article>
                    }
                    else return <article className={styles.article} key={index}>
                        <SingleArticle article={article}></SingleArticle>
                    </article>
                })
            }
            {isLoading && <div className='loader'>Loading...</div>}
            {error && <div>error occured while loading page {currentPage + ' - ' + error}</div>}
        </div>


    )

}
