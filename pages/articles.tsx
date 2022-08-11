import { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { client, getIntersectInstance, getLocalArticles } from '../common';
import styles from '../styles/Article.module.css';
import { AddArticle } from './addArticle';
import { GET_ARTICLES } from './api/graphQueries';
import { SingleArticle } from './article';
import { articleType } from './types/article.type';

export default function Articles() {
    const oberver: MutableRefObject<any> = useRef();

    const [currentPage, setCurrentPage] = useState(0);
    const [articles, setArticles] = useState([] as articleType[]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const canYeildMore = useRef(true);
    const isLocalArticleAdded = useRef(false);

    // local articles fetch
    useEffect(() => {
        if (!isLocalArticleAdded.current) {
            isLocalArticleAdded.current = true;
            let localArticles = getLocalArticles();
            setArticles(prev => ([...localArticles, ...prev]))
        }
    }, [isLocalArticleAdded])


    // remote articles fetch
    useMemo(() => {
        if (currentPage != null && canYeildMore.current) {
            client.query({ query: GET_ARTICLES, variables: { page: currentPage } }).then(result => {
                setIsLoading(false);
                if (result?.data?.retrievePageArticles?.length > 0) {
                    let nextPage = result?.data?.retrievePageArticles;
                    setArticles(art => ([...art, ...nextPage]))
                } else {
                    canYeildMore.current = false;
                }
            }, e => setError(e))
        }
    }, [currentPage])


    // last article connet to invoke next page data
    const lastArticleWatchReference = useCallback((node: any) => {
        if (isLoading) return;
        focusConnect(node);

    }, [articles])


    // connect focus with last element
    function focusConnect(node: any) {
        if (oberver && oberver.current) oberver.current.disconnect();
        oberver.current = getIntersectInstance(() => {
            oberver.current.disconnect();
            if (canYeildMore.current) {
                setCurrentPage(page => page + 1);
            }
        });

        if (node) oberver.current.observe(node);
    }

    // callback for child component to invoke last locally added article
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
