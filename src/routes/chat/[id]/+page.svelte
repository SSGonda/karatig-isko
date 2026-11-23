<script lang="ts">
	import { page } from '$app/state';
	import { listings } from '#lib/data/listings.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { ArrowLeft, ImagePlus, Info, MoreHorizontal, Paperclip, Send } from '@lucide/svelte';

	const listingId = Number(page.params.id);
	const listing = listings.find((item) => item.id === listingId) ?? listings[0];
	let message = $state('');
	let messages = $state([
		{ mine: false, text: `Hi! Is the room still available for next month?`, time: '10:31 AM' },
		{ mine: true, text: `Yes, it is! We can schedule a viewing this week.`, time: '10:33 AM' },
		{ mine: false, text: `Great. Are utilities included in the monthly rent?`, time: '10:35 AM' },
		{ mine: true, text: `Water and Wi-Fi are included. Electricity is charged separately based on actual use.`, time: '10:36 AM' }
	]);

	function sendMessage() {
		const text = message.trim();
		if (!text) return;
		messages = [...messages, { mine: false, text, time: 'Now' }];
		message = '';
	}
</script>

<main class="mx-auto grid max-w-[1440px] gap-0 px-4 py-6 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)_320px] lg:px-8">
	<aside class="hidden rounded-l-2xl border border-r-0 border-[#dde3dc] bg-white lg:block">
		<div class="border-b border-[#edf0ec] p-4">
			<h2 class="font-black">Messages</h2>
		</div>
		{#each listings.slice(0, 6) as item, i}
			<button class={`flex w-full gap-3 border-b border-[#edf0ec] p-3 text-left ${i === 0 ? 'bg-[#edf3ef]' : 'hover:bg-[#f7f8f6]'}`}>
				<div class="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#dce9df] text-sm font-black text-[#176b4d]">{item.sellerInitials}</div>
				<div class="min-w-0">
					<div class="flex items-center justify-between gap-2">
						<p class="truncate text-sm font-bold">{item.seller}</p>
						<span class="text-[10px] text-[#718078]">{i === 0 ? '10m' : `${i + 1}h`}</span>
					</div>
					<p class="mt-1 truncate text-xs text-[#718078]">{i === 0 ? 'Electricity is charged separately...' : item.name}</p>
				</div>
			</button>
		{/each}
	</aside>

	<section class="flex min-h-[650px] flex-col overflow-hidden border border-[#dde3dc] bg-white lg:rounded-r-2xl xl:rounded-none">
		<header class="flex h-16 items-center justify-between border-b border-[#edf0ec] px-4">
			<div class="flex items-center gap-3">
				<a href="/" class="lg:hidden"><ArrowLeft class="size-5" /></a>
				<div class="flex size-10 items-center justify-center rounded-full bg-[#dce9df] text-sm font-black text-[#176b4d]">{listing.sellerInitials}</div>
				<div>
					<p class="text-sm font-black">{listing.seller}</p>
					<p class="text-xs text-[#718078]">Typically replies within an hour</p>
				</div>
			</div>
			<Button variant="ghost" size="icon"><MoreHorizontal class="size-5" /></Button>
		</header>

		<div class="flex-1 space-y-4 overflow-y-auto bg-[#fafbf9] p-4 sm:p-6">
			<div class="mx-auto mb-6 max-w-sm rounded-xl border border-[#dde3dc] bg-white p-3 shadow-sm">
				<div class="flex gap-3">
					<img src={listing.image} alt={listing.name} class="size-16 rounded-lg object-cover" />
					<div class="min-w-0">
						<p class="truncate text-sm font-black">{listing.name}</p>
						<p class="mt-1 text-xs text-[#718078]">{listing.location}</p>
						<p class="mt-2 text-sm font-black text-[#176b4d]">₱{listing.rent.toLocaleString()} / month</p>
					</div>
				</div>
			</div>

			{#each messages as item}
				<div class={`flex ${item.mine ? 'justify-end' : 'justify-start'}`}>
					<div class={`max-w-[75%] ${item.mine ? 'items-end' : 'items-start'} flex flex-col`}>
						<div class={`rounded-2xl px-4 py-2.5 text-sm leading-5 ${item.mine ? 'rounded-br-md bg-[#176b4d] text-white' : 'rounded-bl-md border border-[#dde3dc] bg-white text-[#18231d]'}`}>
							{item.text}
						</div>
						<span class="mt-1 text-[10px] text-[#718078]">{item.time}</span>
					</div>
				</div>
			{/each}

			<div class="ml-auto max-w-[280px] rounded-2xl border border-[#b9cfc2] bg-[#edf3ef] p-4">
				<p class="text-xs font-bold uppercase tracking-wider text-[#718078]">Quotation</p>
				<div class="mt-2 flex items-end justify-between">
					<div>
						<p class="text-xs text-[#68766e]">Monthly rent</p>
						<p class="text-xl font-black text-[#176b4d]">₱{listing.rent.toLocaleString()}</p>
					</div>
					<Badge class="bg-white text-[#176b4d]">Pending</Badge>
				</div>
			</div>
		</div>

		<footer class="border-t border-[#edf0ec] bg-white p-3">
			<div class="flex items-center gap-2">
				<Button variant="ghost" size="icon" class="shrink-0 text-[#68766e]"><ImagePlus class="size-5" /></Button>
				<Button variant="ghost" size="icon" class="shrink-0 text-[#68766e]"><Paperclip class="size-5" /></Button>
				<Input bind:value={message} onkeydown={(event) => event.key === 'Enter' && sendMessage()} placeholder="Write a message..." class="h-10 rounded-full" />
				<Button size="icon" class="shrink-0 rounded-full bg-[#176b4d]" onclick={sendMessage}><Send class="size-4" /></Button>
			</div>
		</footer>
	</section>

	<aside class="hidden rounded-r-2xl border border-l-0 border-[#dde3dc] bg-white p-4 xl:block">
		<div class="flex items-center justify-between">
			<h3 class="font-black">Listing details</h3>
			<Info class="size-4 text-[#718078]" />
		</div>
		<img src={listing.image} alt={listing.name} class="mt-4 h-36 w-full rounded-xl object-cover" />
		<h4 class="mt-4 font-black">{listing.name}</h4>
		<p class="mt-1 text-xs text-[#718078]">{listing.location}</p>
		<div class="mt-4 grid grid-cols-2 gap-2 text-xs">
			<div class="rounded-lg bg-[#f3f5f2] p-3"><p class="text-[#718078]">Rent</p><p class="mt-1 font-black">₱{listing.rent.toLocaleString()}</p></div>
			<div class="rounded-lg bg-[#f3f5f2] p-3"><p class="text-[#718078]">Capacity</p><p class="mt-1 font-black">{listing.perRoom} / room</p></div>
		</div>
		<Button href="/" variant="outline" class="mt-4 w-full rounded-lg">View full listing</Button>
	</aside>
</main>
