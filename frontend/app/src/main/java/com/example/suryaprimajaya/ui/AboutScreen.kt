package com.example.suryaprimajaya.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AboutScreen() {
    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Text("Tentang Kami", fontWeight = FontWeight.Bold, color = WalnutBrown)
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
                .padding(24.dp)
        ) {
            Text(
                text = "CV Surya Prima Jaya",
                fontSize = 32.sp, // Equivalent to text-5xl
                fontWeight = FontWeight.Bold,
                color = WalnutBrown,
                lineHeight = 40.sp
            )

            Spacer(modifier = Modifier.height(24.dp))

            // Paragraph 1
            Text(
                text = "Di Surya Prima Jaya, anda dapat memesan veneer kayu dengan kualitas terbaik. Dengan variasi kayu lokal anda dapat memilih kayu yang sesuai untuk pemakaian anda. Kayu kami dipilih dengan ketelitian untuk memastikan kepuasan anda.",
                fontSize = 18.sp, // text-lg
                color = DarkText.copy(alpha = 0.9f),
                lineHeight = 28.sp
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Paragraph 2
            Text(
                text = "Tunggu apa lagi? Lihat katalog produk kami, pilih produk kami, kontak narahubung kami!",
                fontSize = 18.sp,
                color = DarkText.copy(alpha = 0.9f),
                lineHeight = 28.sp
            )

            Spacer(modifier = Modifier.height(32.dp))

            // Address Card
            Card(
                shape = RoundedCornerShape(8.dp),
                colors = CardDefaults.cardColors(containerColor = CardWhite),
                elevation = CardDefaults.cardElevation(2.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(24.dp)) {
                    Text(
                        text = "Alamat Kami",
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Bold,
                        color = WalnutBrown
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = "Kampung Babakan RT 03/04, Binong, Curug, Tangerang 15810",
                        fontSize = 16.sp,
                        color = DarkText
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Dekat Masjid Al-Hidayah",
                        fontSize = 16.sp,
                        color = DarkText
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Contact Info
            Text(
                text = "Untuk informasi lebih lanjut hubungi +62 896 5434 3198 (Yoga Wibowo)",
                fontSize = 16.sp,
                color = DarkText
            )

            Spacer(modifier = Modifier.height(48.dp))

            // Reuse Footer from HomeScreen
            Footer()
        }
    }
}