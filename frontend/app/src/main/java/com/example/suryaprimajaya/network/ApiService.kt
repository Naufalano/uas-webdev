package com.example.suryaprimajaya.network

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.GET
import com.example.suryaprimajaya.model.Product

interface ApiService {
    @GET("/api/products")
    suspend fun getProducts(): List<Product>
}

object RetrofitClient {
    private const val BASE_URL = "http://ykd.dev:15022"

    val api: ApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }
}