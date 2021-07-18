import { ReOrder } from 'app/models/re-order';
import { Observable } from 'rxjs/Observable';
import { Category } from 'app/models/Category';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../helper/httpService';
import { RestAPI } from '../helper/api.constants';
import 'rxjs/add/operator/publishReplay';
import { UrlUtils } from 'app/common/utils/url-utils';

@Injectable()
export class CategoryService extends HttpService {

    allCategoies: Observable<{}>;

    constructor(http: HttpClient) {
        super(http);
    }

    getAllCategories(categoryType: CategoryType, isCache: boolean) {
        if (isCache) {

            this.loadCategoriesFromServer();

            return this.allCategoies
                .map((categoies: Category[]) => {
                    return categoies.filter(category => category.category_type === categoryType)
                });
        } else {
            return this.get(
                UrlUtils.formatUrl(RestAPI.GET_ALL_CATEGORY_BY_TYPE, categoryType));
        }
    }

    getFeaturedCategoriesForParentCategory(parentCategoryId: string) {

        this.loadCategoriesFromServer();

        return this.allCategoies
            .map((categoies: Category[]) => {
                return categoies.filter(category => category.parent_category_id === parentCategoryId && category.category_type === CategoryType.Featured)
            });
    }

    getCategoriesByIds(categoryids: string[]) {

        this.loadCategoriesFromServer();

        return this.allCategoies
            .map((categoies: Category[]) => {
                return categoies.filter(category => categoryids.indexOf(category.id) !== -1)
            });
    }

    getCategory(id: string, isCache: boolean) {

        if (isCache) {

            this.loadCategoriesFromServer();

            return this.allCategoies
                .map((categoies: Category[]) => categoies.find(category => category.id === id));
        } else {
            return this.get(RestAPI.GET_CATEGORY + '/' + id);
        }
    }

    private loadCategoriesFromServer() {
        if (!this.allCategoies) {
            this.allCategoies = this.get(RestAPI.GET_ALL_CATEGORY)
                .publishReplay(1)
                .refCount();
        }
    }

    getAllCategoriesForAdmin(){
        return this.get(RestAPI.GET_ALL_CATEGORY);
    }

    addCategory(formData: FormData, categoryType: CategoryType) {
        return this.post(
            UrlUtils.formatUrl(RestAPI.POST_CREATE_CATEGORY, categoryType),
            formData);
    }
    updateCategory(formData: FormData, categoryId: string,
        categoryType: CategoryType) {
        return this.put(
            UrlUtils.formatUrl(RestAPI.PUT_UPDATE_CATEGORY, categoryType, categoryId),
            formData);
    }
    deleteCategory(categoryId: string) {
        return this.delete(RestAPI.DELETE_CATEGORY + '/' + categoryId);
    }
    reorder(ordered: ReOrder[], categoryType: CategoryType) {
        return this.put(
            UrlUtils.formatUrl(RestAPI.PUT_REORDER_CATEGORY, categoryType),
            ordered);
    }
}

export enum CategoryType {
    Category = 1,
    Celebrity = 2,
    Genre = 3,
    Featured = 4,
    PayPerView = 5,
    Channel = 6,
    Radio = 7,
    HomeCategory = 8,
}
