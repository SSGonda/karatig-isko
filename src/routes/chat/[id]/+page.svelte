<script lang="ts">
	import { page } from '$app/state';
	import { listings } from '#lib/data/listings.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import {
		ArrowLeft,
		ExternalLink,
		ImagePlus,
		Info,
		MapPin,
		MoreHorizontal,
		Paperclip,
		Send
	} from '@lucide/svelte';

	let listingId = $derived(Number(page.url.pathname.match(/\/chat\/([^/?#]+)/)?.[1]));
	let listing = $derived(listings.find((item) => item.id === listingId) ?? listings[0]);
	let message = $state('');
	let quotationResponse = $state<'Pending' | 'Yes' | 'No' | 'Negotiate'>('Pending');
	let negotiateOpen = $state(false);
	let negotiatedPrice = $state(0);
	let negotiatedOffer = $state<number | null>(null);
	const negotiationStep = 250;
	let minimumNegotiatedPrice = $derived(
		Math.floor((listing.rent * 0.7) / negotiationStep) * negotiationStep
	);
	let messages = $state([
		{ mine: true, text: `Hi! Is the room still available for next month?`, time: '10:31 AM' },
		{ mine: false, text: `Yes, it is! We can schedule a viewing this week.`, time: '10:33 AM' },
		{ mine: true, text: `Great. Are utilities included in the monthly rent?`, time: '10:35 AM' },
		{
			mine: false,
			text: `Water and Wi-Fi are included. Electricity is charged separately based on actual use.`,
			time: '10:36 AM'
		}
	]);

	function sendMessage() {
		const text = message.trim();
		if (!text) return;
		messages = [...messages, { mine: true, text, time: 'Now' }];
		message = '';
	}

	function openNegotiation() {
		negotiatedPrice = listing.rent;
		quotationResponse = 'Negotiate';
		negotiateOpen = true;
	}

	function updateNegotiatedPrice(value: number) {
		negotiatedPrice = Math.min(
			listing.rent,
			Math.max(minimumNegotiatedPrice, value || minimumNegotiatedPrice)
		);
	}

	function sendNegotiatedPrice() {
		const text = `I'd like to negotiate the monthly rent to ₱${negotiatedPrice.toLocaleString()}.`;
		messages = [...messages, { mine: true, text, time: 'Now' }];
		negotiatedOffer = negotiatedPrice;
		negotiateOpen = false;
	}

	function acceptQuotation() {
		if (quotationResponse === 'Yes') return;
		quotationResponse = 'Yes';
		messages = [
			...messages,
			{
				mine: true,
				text: `Accepted the monthly rent quotation of ₱${listing.rent.toLocaleString()}.`,
				time: 'Now'
			}
		];
	}
</script>

<main
	class="grid h-[calc(100vh-4rem)] min-h-0 w-full gap-0 lg:grid-cols-[280px_minmax(0,1fr)_320px]"
>
	<aside
		class="hidden min-h-0 overflow-hidden border border-r-0 border-[#dde3dc] bg-white lg:block"
	>
		<div class="border-b border-[#edf0ec] p-4">
			<h2 class="font-black">Messages</h2>
		</div>
		<div class="h-[calc(100%-3.5rem)] overflow-y-auto">
			{#each listings.slice(0, 6) as item, i}
				<a
					href={`/chat/${item.id}`}
					class={`flex w-full gap-3 border-b border-[#edf0ec] p-3 text-left ${item.id === listingId ? 'bg-[#edf3ef]' : 'hover:bg-[#f7f8f6]'}`}
					aria-current={item.id === listingId ? 'page' : undefined}
				>
					<div
						class="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#dce9df] text-sm font-black text-[#176b4d]"
					>
						{item.sellerInitials}
					</div>
					<div class="min-w-0">
						<div class="flex items-center justify-between gap-2">
							<p class="truncate text-sm font-bold">{item.seller}</p>
							<span class="text-[10px] text-[#718078]">{i === 0 ? '10m' : `${i + 1}h`}</span>
						</div>
						<p class="mt-1 truncate text-xs text-[#718078]">
							{i === 0 ? 'Electricity is charged separately...' : item.name}
						</p>
					</div>
				</a>
			{/each}
		</div>
	</aside>

	<section
		class="flex min-h-0 flex-col overflow-hidden border-y border-[#dde3dc] bg-white lg:border"
	>
		<header class="flex h-16 items-center justify-between border-b border-[#edf0ec] px-4">
			<div class="flex items-center gap-3">
				<a href="/" class="lg:hidden"><ArrowLeft class="size-5" /></a>
				<div
					class="flex size-10 items-center justify-center rounded-full bg-[#dce9df] text-sm font-black text-[#176b4d]"
				>
					{listing.sellerInitials}
				</div>
				<div>
					<p class="text-sm font-black">{listing.seller}</p>
					<p class="text-xs text-[#718078]">Typically replies within an hour</p>
				</div>
			</div>
			<Button variant="ghost" size="icon"><MoreHorizontal class="size-5" /></Button>
		</header>

		<div class="flex-1 overflow-y-auto bg-[#fafbf9] p-4 sm:p-6">
			<div class="mx-auto mb-6 max-w-sm rounded-xl border border-[#dde3dc] bg-white p-3 shadow-sm">
				<div class="flex gap-3">
					<img src={listing.image} alt={listing.name} class="size-16 rounded-lg object-cover" />
					<div class="min-w-0">
						<p class="truncate text-sm font-black">{listing.name}</p>
						<p class="mt-1 text-xs text-[#718078]">{listing.location}</p>
						<p class="mt-2 text-sm font-black text-[#176b4d]">
							₱{listing.rent.toLocaleString()} / month
						</p>
					</div>
				</div>
			</div>

			{#each messages as item}
				<div class={`flex ${item.mine ? 'justify-end' : 'justify-start'}`}>
					<div class={`max-w-[75%] ${item.mine ? 'items-end' : 'items-start'} flex flex-col`}>
						<div
							class={`rounded-2xl px-4 py-2.5 text-sm leading-5 ${item.mine ? 'rounded-br-md bg-[#176b4d] text-white' : 'rounded-bl-md border border-[#dde3dc] bg-white text-[#18231d]'}`}
						>
							{item.text}
						</div>
						<span class="mt-1 text-[10px] text-[#718078]">{item.time}</span>
					</div>
				</div>
			{/each}

			{#if quotationResponse === 'Pending'}
				<div class="mr-auto max-w-[280px] rounded-2xl border border-[#dde3dc] bg-white p-4">
					<p class="text-xs font-bold tracking-wider text-[#718078] uppercase">Quotation</p>
					<div class="mt-2 flex items-end justify-between">
						<div>
							<p class="text-xs text-[#68766e]">Monthly rent</p>
							<p class="text-xl font-black text-[#176b4d]">₱{listing.rent.toLocaleString()}</p>
						</div>
					</div>
					<div class="mt-3 flex flex-wrap gap-2">
						<Button
							size="sm"
							variant="outline"
							class="h-8 rounded-lg border-[#b9cfc2] px-3 text-xs text-[#176b4d]"
							onclick={acceptQuotation}
						>
							Yes
						</Button>
						<Button
							size="sm"
							variant="outline"
							class="h-8 rounded-lg border-[#e9b09a] px-3 text-xs text-[#ef7d57]"
							onclick={() => {
								quotationResponse = 'No';
								messages = [
									...messages,
									{ mine: true, text: 'Declined the monthly rent quotation.', time: 'Now' }
								];
							}}
						>
							No
						</Button>
						<Button
							size="sm"
							variant="outline"
							class="h-8 rounded-lg border-[#b9cfc2] px-3 text-xs text-[#176b4d]"
							onclick={openNegotiation}
						>
							Negotiate
						</Button>
					</div>
				</div>
			{/if}
		</div>

		<footer class="border-t border-[#edf0ec] bg-white p-3">
			<div class="flex items-center gap-2">
				<Button variant="ghost" size="icon" class="shrink-0 text-[#68766e]">
					<ImagePlus class="size-5" />
				</Button>
				<Button variant="ghost" size="icon" class="shrink-0 text-[#68766e]">
					<Paperclip class="size-5" />
				</Button>
				<Input
					bind:value={message}
					onkeydown={(event) => event.key === 'Enter' && sendMessage()}
					placeholder="Write a message..."
					class="h-10 rounded-full"
				/>
				<Button size="icon" class="shrink-0 rounded-full bg-[#176b4d]" onclick={sendMessage}>
					<Send class="size-4" />
				</Button>
			</div>
		</footer>
	</section>

	<aside
		class="hidden min-h-0 overflow-y-auto border border-l-0 border-[#dde3dc] bg-white p-4 xl:block"
	>
		<div class="flex items-center justify-between">
			<h3 class="font-black">Listing details</h3>
			<Info class="size-4 text-[#718078]" />
		</div>
		<img src={listing.image} alt={listing.name} class="mt-4 h-36 w-full rounded-xl object-cover" />
		<div class="mt-4">
			<div class="flex items-start justify-between gap-3">
				<h4 class="font-black">{listing.name}</h4>
				<span
					class="shrink-0 rounded-full bg-[#edf3ef] px-2 py-1 text-[10px] font-bold text-[#176b4d]"
				>
					{listing.available}
				</span>
			</div>
			<p class="mt-2 flex items-center gap-1 text-xs text-[#718078]">
				<MapPin class="size-3.5" />
				{listing.location}
			</p>
		</div>
		<div class="mt-4 grid grid-cols-2 gap-2 text-xs">
			<div class="rounded-lg bg-[#f3f5f2] p-3">
				<p class="text-[#718078]">Rent</p>
				<p class="mt-1 font-black">₱{listing.rent.toLocaleString()}</p>
			</div>
			<div class="rounded-lg bg-[#f3f5f2] p-3">
				<p class="text-[#718078]">Capacity</p>
				<p class="mt-1 font-black">{listing.perRoom} / room</p>
			</div>
			<div class="rounded-lg bg-[#f3f5f2] p-3">
				<p class="text-[#718078]">Area</p>
				<p class="mt-1 font-black">{listing.area}</p>
			</div>
			<div class="rounded-lg bg-[#f3f5f2] p-3">
				<p class="text-[#718078]">Available for</p>
				<p class="mt-1 font-black">
					{listing.gender === 'Any' ? 'All genders' : listing.gender === 'Male' ? 'Male' : 'Female'}
				</p>
			</div>
		</div>
		<div class="mt-2 grid grid-cols-2 gap-2 text-xs">
			<div class="rounded-lg bg-[#f3f5f2] p-3">
				<p class="text-[#718078]">Minimum stay</p>
				<p class="mt-1 font-black">{listing.minimumStayMonths} months</p>
			</div>
			<div class="rounded-lg bg-[#f3f5f2] p-3">
				<p class="text-[#718078]">Maximum stay</p>
				<p class="mt-1 font-black">{listing.maximumStayMonths} months</p>
			</div>
		</div>
		{#if negotiatedOffer !== null}
			<div class="mt-4 rounded-xl border border-[#efbda8] bg-[#fff8f5] p-4">
				<div class="flex items-center justify-between gap-3">
					<p class="text-xs font-bold tracking-wider text-[#ef7d57] uppercase">Negotiation</p>
					<span class="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-[#ef7d57]">
						Offer sent
					</span>
				</div>
				<div class="mt-3 grid grid-cols-2 gap-2">
					<div>
						<p class="text-[10px] text-[#718078]">Original rent</p>
						<p class="mt-1 text-sm font-black text-[#68766e]">
							₱{listing.rent.toLocaleString()}
						</p>
					</div>
					<div>
						<p class="text-[10px] text-[#718078]">Your offer</p>
						<p class="mt-1 text-sm font-black text-[#ef7d57]">
							₱{negotiatedOffer.toLocaleString()}
						</p>
					</div>
				</div>
			</div>
		{/if}
		<p class="mt-4 text-xs leading-5 text-[#68766e]">{listing.description}</p>
		<Button
			href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${listing.name}, ${listing.location}, Quezon City, Philippines`)}`}
			target="_blank"
			rel="noopener noreferrer"
			variant="outline"
			class="mt-4 w-full rounded-lg border-[#b9cfc2] font-bold text-[#176b4d]"
		>
			<MapPin class="size-4" />
			View on Maps
			<ExternalLink class="size-3.5" />
		</Button>
		<Button href={`/listing/${listing.id}`} variant="outline" class="mt-2 w-full rounded-lg">
			View full listing
		</Button>
	</aside>
</main>

{#if negotiateOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-[#18231d]/40 p-4"
		role="presentation"
		onclick={(event) => event.target === event.currentTarget && (negotiateOpen = false)}
	>
		<div
			class="w-full max-w-md rounded-2xl bg-white p-5 shadow-[0_20px_60px_rgba(24,35,29,0.25)]"
			role="dialog"
			aria-modal="true"
			aria-labelledby="negotiate-title"
		>
			<h2 id="negotiate-title" class="text-lg font-black">Negotiate monthly rent</h2>
			<p class="mt-1 text-sm text-[#718078]">Choose an offer or enter a custom amount.</p>

			<div class="mt-5">
				<div class="mb-3 flex items-end justify-between">
					<span class="text-xs font-bold text-[#68766e]">Your offer</span>
					<span class="text-2xl font-black text-[#176b4d]">
						₱{negotiatedPrice.toLocaleString()}
					</span>
				</div>
				<input
					type="range"
					min={minimumNegotiatedPrice}
					max={listing.rent}
					step="1"
					value={negotiatedPrice}
					oninput={(event) => updateNegotiatedPrice(Number(event.currentTarget.value))}
					aria-label="Negotiated monthly rent"
					class="h-2 w-full cursor-pointer accent-[#176b4d]"
				/>
				<div class="mt-2 flex justify-between text-xs text-[#718078]">
					<span>₱{minimumNegotiatedPrice.toLocaleString()}</span>
					<span>₱{listing.rent.toLocaleString()}</span>
				</div>
				<button
					type="button"
					class="mt-3 text-xs font-bold text-[#176b4d] underline decoration-[#b9cfc2] underline-offset-2"
					onclick={() => (negotiatedPrice = listing.rent)}
				>
					Use seller's original price
				</button>
			</div>

			<label class="mt-5 block">
				<span class="mb-2 block text-xs font-bold text-[#68766e]">Custom amount</span>
				<div class="relative">
					<span class="absolute top-1/2 left-3 -translate-y-1/2 text-sm font-bold text-[#68766e]">
						₱
					</span>
					<Input
						type="number"
						min={minimumNegotiatedPrice}
						max={listing.rent}
						step="1"
						value={negotiatedPrice}
						oninput={(event) => updateNegotiatedPrice(Number(event.currentTarget.value))}
						class="h-11 pl-8"
						aria-label="Custom negotiated rent"
					/>
				</div>
			</label>

			<div class="mt-6 flex justify-end gap-2">
				<Button variant="outline" class="rounded-lg" onclick={() => (negotiateOpen = false)}>
					Cancel
				</Button>
				<Button class="rounded-lg bg-[#176b4d] font-bold" onclick={sendNegotiatedPrice}>
					Send offer
				</Button>
			</div>
		</div>
	</div>
{/if}
