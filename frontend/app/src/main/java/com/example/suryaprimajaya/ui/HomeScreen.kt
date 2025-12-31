package com.example.suryaprimajaya.ui

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.suryaprimajaya.model.Product
import com.example.suryaprimajaya.network.RetrofitClient

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen() {
    var products by remember { mutableStateOf<List<Product>>(emptyList()) }
    var loading by remember { mutableStateOf(true) }

    LaunchedEffect(Unit) {
        try {
            products = RetrofitClient.api.getProducts()
        } catch (e: Exception) {
            e.printStackTrace()
        } finally {
            loading = false
        }
    }

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Text(
                        "Surya Prima Jaya",
                        fontWeight = FontWeight.Bold,
                        color = WalnutBrown
                    )
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                    containerColor = CreamBackground.copy(alpha = 0.95f)
                )
            )
        },
        containerColor = CreamBackground
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
        ) {
            // --- HERO SECTION ---
            Column(
                modifier = Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "Variasi Kayu Berkualitas",
                    style = MaterialTheme.typography.displaySmall.copy(
                        fontWeight = FontWeight.Bold,
                        color = WalnutBrown
                    ),
                    textAlign = TextAlign.Center
                )
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = "Dengan kayu pilihan terbaik, anda tidak perlu khawatir kayu pesanan anda dimakan usia.",
                    style = MaterialTheme.typography.bodyLarge.copy(color = MutedText),
                    textAlign = TextAlign.Center
                )
            }

            // --- PRODUCT SLIDER ---
            if (loading) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(300.dp),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator(color = WalnutBrown)
                }
            } else if (products.isNotEmpty()) {
                ProductSlider(products)
            } else {
                Text(
                    "Tidak ada produk.",
                    modifier = Modifier.fillMaxWidth().padding(20.dp),
                    textAlign = TextAlign.Center
                )
            }

            Spacer(modifier = Modifier.height(48.dp))

            // --- FEATURES SECTION ---
            FeatureSection()

            // --- FOOTER ---
            Footer()
        }
    }
}

// --- COMPONENTS ---

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun ProductSlider(products: List<Product>) {
    val pagerState = rememberPagerState(pageCount = { products.size })

    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        HorizontalPager(
            state = pagerState,
            contentPadding = PaddingValues(horizontal = 24.dp),
            pageSpacing = 16.dp
        ) { page ->
            val product = products[page]
            Card(
                shape = RoundedCornerShape(16.dp),
                elevation = CardDefaults.cardElevation(8.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(320.dp)
            ) {
                Box(modifier = Modifier.fillMaxSize()) {
                    AsyncImage(
                        model = product.gambar_url,
                        contentDescription = product.nama,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier.fillMaxSize()
                    )

                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(
                                Brush.verticalGradient(
                                    colors = listOf(Color.Transparent, Color.Black.copy(alpha = 0.8f)),
                                    startY = 300f
                                )
                            )
                    )

                    Column(
                        modifier = Modifier
                            .align(Alignment.BottomStart)
                            .padding(20.dp)
                    ) {
                        Text(
                            text = product.nama,
                            style = MaterialTheme.typography.headlineSmall,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                        Text(
                            text = product.deskripsi,
                            style = MaterialTheme.typography.bodyMedium,
                            color = Color.White.copy(alpha = 0.9f),
                            maxLines = 2,
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Dots Indicator
        Row(
            horizontalArrangement = Arrangement.Center,
            modifier = Modifier.fillMaxWidth()
        ) {
            repeat(products.size) { iteration ->
                val color = if (pagerState.currentPage == iteration) WalnutBrown else Color.LightGray
                Box(
                    modifier = Modifier
                        .padding(4.dp)
                        .clip(CircleShape)
                        .background(color)
                        .size(if (pagerState.currentPage == iteration) 12.dp else 8.dp)
                )
            }
        }
    }
}

@Composable
fun FeatureSection() {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(CardWhite)
            .padding(vertical = 32.dp, horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(24.dp)
    ) {
        FeatureItem(icon = "🌳", title = "Bahan Baku Berkelanjutan", desc = "Kayu yang diambil dari hutan yang dikelola")
        FeatureItem(icon = "✨", title = "Penanganan Andal", desc = "Profesionalisme menjamin kualitas kayu")
        FeatureItem(icon = "♾️", title = "Tahan Lama", desc = "Kayu kuat tidak khawatir termakan usia")
    }
}

@Composable
fun FeatureItem(icon: String, title: String, desc: String) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Box(
            modifier = Modifier
                .size(60.dp)
                .background(WalnutBrown.copy(alpha = 0.1f), CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Text(text = icon, fontSize = 28.sp)
        }
        Spacer(modifier = Modifier.width(16.dp))
        Column {
            Text(text = title, fontWeight = FontWeight.Bold, color = WalnutBrown, fontSize = 18.sp)
            Text(text = desc, color = MutedText, fontSize = 14.sp)
        }
    }
}

@Composable
fun Footer() {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 24.dp, bottom = 24.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = "© CV. Surya Prima Mandiri",
            style = MaterialTheme.typography.labelMedium,
            color = MutedText
        )
    }
}