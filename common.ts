import { ApolloClient, InMemoryCache } from "@apollo/client";
import gConfig from './apollo.config';
import articleType from "./pages/types/article.type";

export const getIntersectInstance = (callback: any) => {
    return new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                callback();
                return true;
            }
        })
    }, { root: null, rootMargin: '0px', threshold: .2 })
}

export const client = new ApolloClient({
    uri: gConfig.client.service.url,
    cache: new InMemoryCache(),
});

export const getLocalArticles = () => {
    let article = window.localStorage['articles'];
    if (article == undefined) return [];
    let output = JSON.parse(article);

    return output || [];
}

export const saveArticle = (title: string, desc: string, url: string, image: any, callback: any) => {
    image.arrayBuffer().then((data: any) => {


        let localArticles = getLocalArticles();

        let article: articleType = {
            id: '',
            author: 'locally created',
            createdAt: new Date(),
            isThumbnailTried: false,
            score: 0,
            text: desc,
            title: title,
            type: 'story',
            updatedAt: new Date(),
            url: url,
            nail: window.URL.createObjectURL(image)
        }
        localArticles.push(article);
        window.localStorage['articles'] = JSON.stringify(localArticles);

        callback(article);
    })

}   