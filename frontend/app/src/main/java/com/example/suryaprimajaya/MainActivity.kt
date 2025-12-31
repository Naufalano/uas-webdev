package com.example.suryaprimajaya

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Info
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.example.suryaprimajaya.ui.AboutScreen
import com.example.suryaprimajaya.ui.HomeScreen
import com.example.suryaprimajaya.ui.WalnutBrown // Import your colors
import com.example.suryaprimajaya.ui.CreamBackground

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            AppNavigation()
        }
    }
}

@Composable
fun AppNavigation() {
    val navController = rememberNavController()

    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    Scaffold(
        bottomBar = {
            NavigationBar(
                containerColor = CreamBackground,
                contentColor = WalnutBrown
            ) {
                // Home Button
                NavigationBarItem(
                    icon = { Icon(Icons.Filled.Home, contentDescription = "Beranda") },
                    label = { Text("Beranda") },
                    selected = currentRoute == "home",
                    onClick = {
                        navController.navigate("home") {
                            popUpTo("home") { saveState = true }
                            launchSingleTop = true
                            restoreState = true
                        }
                    },
                    colors = NavigationBarItemDefaults.colors(
                        indicatorColor = WalnutBrown.copy(alpha = 0.2f),
                        selectedIconColor = WalnutBrown,
                        selectedTextColor = WalnutBrown,
                        unselectedIconColor = WalnutBrown.copy(alpha = 0.6f),
                        unselectedTextColor = WalnutBrown.copy(alpha = 0.6f)
                    )
                )

                // About Button
                NavigationBarItem(
                    icon = { Icon(Icons.Filled.Info, contentDescription = "Tentang Kami") },
                    label = { Text("Tentang Kami") },
                    selected = currentRoute == "about",
                    onClick = {
                        navController.navigate("about") {
                            popUpTo("home") { saveState = true }
                            launchSingleTop = true
                            restoreState = true
                        }
                    },
                    colors = NavigationBarItemDefaults.colors(
                        indicatorColor = WalnutBrown.copy(alpha = 0.2f),
                        selectedIconColor = WalnutBrown,
                        selectedTextColor = WalnutBrown
                    )
                )
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = "home",
            modifier = Modifier.padding(innerPadding)
        ) {
            composable("home") { HomeScreen() }
            composable("about") { AboutScreen() }
        }
    }
}