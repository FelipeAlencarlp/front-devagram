import axios from 'axios';
import { LoadingHelper } from '../helpers/LoadingHelper';

export default class DevagramApiService {
    constructor() {
        this.axios = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL + '/api'
        });
        // fazer controle da requisição
        this.quantidadeRequisicoes = 0;
        // setar o token do usuário no Header da requisição
        this.axios.interceptors.request.use((config) => {
            this.quantidadeRequisicoes++;
            // exibir o loading se a quantidade de requisições for igual a 1
            if (this.quantidadeRequisicoes === 1) {
                LoadingHelper.exibir();
            }

            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = 'Bearer ' + token;
            }

            return config;
        });

        this.axios.interceptors.response.use((response) => {
            this.quantidadeRequisicoes--;
            // oculta o loading quando não tiver nenhuma requisição
            if (this.quantidadeRequisicoes === 0) {
                LoadingHelper.ocultar();
            }

            return response;
        });
    }

    // métodos bases
    post(url, data) {
        return this.axios.post(url, data);
    }

    get(url) {
        return this.axios.get(url);
    }

    put(url, data) {
        return this.axios.put(url, data);
    }
}