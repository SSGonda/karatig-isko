<script lang="ts">
	import './layout.css';
	import { page } from '$app/state';
	import { Button } from '#lib/components/ui/button/index.js';
	import { House, MessageCircle, UserRound } from '@lucide/svelte';

	const { children } = $props();
</script>

<div class="min-h-screen bg-[#f7f8f6] text-[#18231d]">
	<header class="sticky top-0 z-40 border-b border-[#dde3dc] bg-white/95 backdrop-blur">
		<div class="mx-auto flex h-16 max-w-360 items-center justify-between px-4 sm:px-6 lg:px-8">
			<a href="/" class="flex items-center gap-2.5">
				<div class="flex size-9 items-center justify-center rounded-xl bg-[#176b4d] text-white">
					<House class="size-5" />
				</div>
				<div>
					<div class="text-lg leading-none font-black tracking-tight">Karatig-Isko</div>
					<div class="mt-1 text-[10px] font-bold text-[#718078] uppercase">
						UP Diliman Student Housing Assistance Program
					</div>
				</div>
			</a>

			<nav class="hidden items-center p-1 md:flex">
				<a
					href="/"
					class={page.url.pathname === '/provider'
						? 'px-4 py-1.5 text-sm font-semibold text-[#68766e] hover:text-[#18231d]'
						: 'px-4 py-1.5 text-sm font-bold'}
				>
					Tenant
				</a>
				<a
					href="/provider"
					class={page.url.pathname === '/provider'
						? 'px-4 py-1.5 text-sm font-bold'
						: 'px-4 py-1.5 text-sm font-semibold text-[#68766e] hover:text-[#18231d]'}
				>
					Provider
				</a>
			</nav>

			<div class="flex items-center gap-1.5">
				<Button
					href="/chat/1"
					variant="ghost"
					size="icon"
					class="relative text-[#68766e]"
					aria-label="Open chats"
				>
					<MessageCircle class="size-5" />
					<span
						class="absolute top-2 right-2 size-2 rounded-full border-2 border-white bg-[#ef7d57]"
					></span>
				</Button>
				<Button variant="ghost" size="icon" class="rounded-full bg-[#edf2ed]">
					<UserRound class="size-5" />
				</Button>
			</div>
		</div>
	</header>

	{@render children()}
</div>
