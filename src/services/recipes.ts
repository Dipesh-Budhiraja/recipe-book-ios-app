import { Recipe } from "../models/recipe";
import { Ingredient } from "../models/ingredient";
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';


@Injectable()
export class RecipesService{
    private recipes: Recipe[] = [];

    constructor(private http: Http){}

    addRecipe(title: string, description: string, difficulty: string, ingredients: Ingredient[]){
        this.recipes.push(new Recipe(title, description, difficulty, ingredients));
        console.log(this.recipes);
        
    }

    getRecipes(){
        return this.recipes.slice();
    }

    updateRecipe(index: number, title: string, description: string, difficulty: string, ingredients: Ingredient[]){
        this.recipes[index] = new Recipe(title, description, difficulty, ingredients);
    }

    removeRecipe(index: number){
        this.recipes.splice(index, 1);
    }

    storeList(token){
        return this.http.put();
    }

    fetchList(token){

    }
}