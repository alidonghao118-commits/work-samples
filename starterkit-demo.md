# Starter Kit — Paper plugin sample

**[Download plugin JAR](starterkit-demo-1.0.0.jar)** · **[Download source, tests and plugin ZIP](StarterKit-Paper-demo-1.0.0.zip)**

A small Java plugin for a survival server: players type `/starterkit` to receive a wooden sword, wooden pickaxe and 16 bread. Each player can claim again after the configured cooldown (24 hours by default).

The sample demonstrates command handling, Bukkit permissions, inventory checks and claim history stored by player UUID.

## Try it

1. Use a Paper **1.21.11** test server with Java **21**.
2. Place `starterkit-demo-1.0.0.jar` in the server's `plugins` folder and restart the server.
3. Join and type `/starterkit` with three free storage slots.
4. Type it again: the plugin reports the remaining cooldown and gives no extra items.

Set `cooldown-seconds` in `plugins/StarterKitDemo/config.yml`, then restart to apply it. The supported range is 1–31,536,000 seconds. Permission `starterkit.claim` defaults to true; a permissions plugin can deny it for particular groups.

## Behavior

| Situation | Result |
| --- | --- |
| Eligible player, three free slots | All three stacks are given |
| Repeated command during cooldown | Remaining seconds are shown |
| Fewer than three free slots | Existing inventory and claim eligibility stay unchanged |
| Permission denied or extra command arguments | No items or claim timestamp |
| Claim file cannot be saved | No items are given; the server logs the error |
| Invalid claim history at startup | Plugin disables itself instead of resetting cooldowns |

The three free slots are intentional: this sample leaves existing stacks alone. It uses only ordinary inventory storage, excluding armor and the offhand slot.

## Build and verification

With Java 21 and Maven installed:

```sh
mvn verify
```

Output: `target/starterkit-demo-1.0.0.jar`.

**13 tests passed on September 13, 2026:** six file/cooldown tests and seven command/inventory tests using MockBukkit. Tests cover exact kit contents, repeat commands, permissions, insufficient capacity, usage, console handling, failed writes, reloaded history, independent players, expiry and a clock moving backwards. See [test results](starterkit-test-results.txt) and the test source included in the ZIP.

Compiled against Paper `1.21.11-R0.1-SNAPSHOT`; tests use MockBukkit `4.116.3`. Verification used a mock server, not a live Minecraft client. The command is designed for ordinary Paper, not Folia.

The ledger is saved before items are granted. A process crash between those two steps can consume a claim without delivering its items; an administrator would need to review that claim. This is a compact portfolio example, not a transactional economy system.

## Source and licensing

Original sample code: MIT, see LICENSE in the source ZIP. Paper, Minecraft and test/build dependencies retain their own licenses; they are not included in the plugin JAR. No player data, network calls, analytics or external services are bundled.

Have a small plugin feature in mind? Send the server version and what you want the command to do to [alidonghao118@gmail.com](mailto:alidonghao118@gmail.com).
