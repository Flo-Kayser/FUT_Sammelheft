<script>
	import { settingsStore } from '$lib/stores/settings';
	import { downloadBackup } from '$lib/backupFunctions/downloadBackup';
	import { handleUploadBackup } from '$lib/backupFunctions/uploadBackup';
</script>

<div class="mx-auto mt-10 w-2/3 rounded-lg bg-stone-500/50 px-6 py-12 lg:max-w-4xl">
	<h1 class="mb-8 px-2 text-center text-3xl font-bold">Mein Bereich</h1>

	<div class="flex flex-col gap-4 text-lg *:border-b">
		<div class="gap-2 py-2">
			<div class="px-2 text-sm text-stone-900 md:text-base">
				Lege fest, welchen Gesamtzähler du für dein Sammelheft verwenden möchtest (Basic Karten sind
				dabei Gold, Silber und Bronze):
			</div>
			<label
				class="my-2 flex cursor-pointer flex-col items-center gap-2 pl-8 text-xs font-bold md:flex-row md:text-base"
			>
				<span class="mb-2 md:mb-0">Ohne Basic Karten</span>
				<input
					type="checkbox"
					value=""
					class="peer sr-only rotate-90 md:rotate-0"
					bind:checked={$settingsStore.globalCounterWithBaseCards}
				/>
				<div
					class="peer relative h-6 w-11 rotate-90 rounded-full bg-amber-500 peer-checked:bg-amber-500 peer-focus:outline-none after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white md:rotate-0 rtl:peer-checked:after:-translate-x-full"
				></div>

				<span class="mt-2 md:mt-0">Mit Basic Karten</span>
			</label>
		</div>
		<div class="flex flex-col gap-4 pt-2 pb-40">
			<div class="px-2 text-sm text-stone-900 md:text-lg">
				Wähle aus, welche Infos auf deinen Karten angezeigt werden:
			</div>
			<div class="flex flex-col gap-2 text-black md:pl-8">
				{#each [{ label: 'PlayStyles:', key: 'showPlayStylePlus' }, { label: 'Alternativpositionen:', key: 'showPossiblePositions' }, { label: 'Skill Moves und Schwacher Fuß:', key: 'showSkillMoves' }, { label: 'Anzeigen von Icons der SBC-Karten:', key: 'showSbcIcons' }, { label: 'Anzeigen von Icons der Objective-Karten:', key: 'showObjIcons' }, { label: 'Animation abspielen beim freischalten der Karte', key: 'playAnimationOnCardCollect' }] as item}
					<label
						class="flex w-full items-center justify-between gap-4 text-xs font-bold last:mt-4 md:text-base"
					>
						<div>{item.label}</div>
						<input type="checkbox" bind:checked={$settingsStore[item.key]} class="peer sr-only" />
						<div class="peer relative h-5 min-w-5 rounded-sm bg-white peer-checked:bg-amber-500">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								class="absolute top-0.5 left-0.5 text-white"
							>
								<g fill="none" fill-rule="evenodd">
									<path
										d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
									/>
									<path
										fill="currentColor"
										d="M21.546 5.111a1.5 1.5 0 0 1 0 2.121L10.303 18.475a1.6 1.6 0 0 1-2.263 0L2.454 12.89a1.5 1.5 0 1 1 2.121-2.121l4.596 4.596L19.424 5.111a1.5 1.5 0 0 1 2.122 0"
										stroke-width="2"
										stroke="currentColor"
									/>
								</g>
							</svg>
						</div>
					</label>
				{/each}

				<label
					for="highlightDurationInSec"
					class="flex w-full items-center justify-between gap-4 text-xs font-bold last:mt-4 md:text-base"
				>
					<span
						>Legt fest, wie lange ein Spieler visuell hervorgehoben wird, nachdem er gesucht wurde
						(in Sekunden).</span
					>
					<input
						type="number"
						name="highlightDurationInSec"
						id="highlightDurationInSec"
						min="1"
						max="10"
						step="1"
						bind:value={$settingsStore.highlightDurationInSec}
						class="rounded-md border-2 border-amber-500/70 bg-white px-2 py-1 text-xs font-bold text-stone-900 w-16 md:text-base"
					/>
				</label>
			</div>
		</div>
		<div class="py-2">
			<div class="text-center text-2xl font-black text-stone-900">Sammelheft sichern</div>
			<div class="px-2 text-sm text-stone-900">
				Hier kannst du dir eine Sicherungskopie herunterladen und lokal Speichern:
			</div>
			<div class="md:pl-8">
				<button
					on:click={downloadBackup}
					class="mt-2 flex w-full cursor-pointer items-center gap-2 rounded-md bg-amber-500/70 px-4 py-2 text-sm font-bold text-stone-900 hover:bg-amber-600 md:w-max md:text-base"
				>
					Sicherungskopie herunterladen
					<div class="min-w-6">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
							><path
								fill="currentColor"
								d="M18 20.289L21.288 17l-.688-.688l-2.1 2.1v-4.887h-1v4.887l-2.1-2.1l-.688.688zM14.5 23.5v-1h7v1zm-8.384-4q-.652 0-1.134-.482T4.5 17.884V4.116q0-.652.482-1.134T6.116 2.5H13L18.5 8v3.14h-1V8.5h-5v-5H6.116q-.231 0-.424.192t-.192.423v13.77q0 .23.192.423t.423.192h6v1zm-.616-1v-15z"
								stroke-width="0.7"
								stroke="currentColor"
							/></svg
						>
					</div>
				</button>
			</div>
			<div class="mt-4 border-t border-dashed px-2 pt-2 text-sm text-stone-900 md:text-base">
				Hier kannst du deine Sicherungkopie hochladen:
			</div>
			<div class="mb-4 pl-2 md:pl-8">
				<div class="text-xs text-stone-900 md:text-sm">
					<span class="font-bold">Achtung:</span> Beim Hochladen wird dein aktuelles Sammelheft überschrieben!
				</div>
				<div class="mt-2">
					<input
						class="block w-full cursor-pointer rounded-lg border-2 border-amber-500/70 bg-white px-2 py-1 text-xs"
						aria-describedby="file_input_help"
						accept="application/json"
						type="file"
						on:change={handleUploadBackup}
					/>
					<p class="mt-1 text-xs text-stone-900" id="file_input_help">
						Nur json-Dateien sind erlaubt. Die Datei muss das Format
						<code class="font-bold text-black">fut-sammelheft_backup_YYYY-MM-DD_HH-MM-SS.json</code>
						haben.
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
