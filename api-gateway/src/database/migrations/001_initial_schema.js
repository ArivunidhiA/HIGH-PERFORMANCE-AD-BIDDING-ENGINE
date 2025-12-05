export function up(knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('email').unique().notNullable();
      table.string('password_hash').notNullable();
      table.string('api_key').unique();
      table.string('role').defaultTo('user');
      table.timestamps(true, true);
    })
    .createTable('campaigns', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.string('name').notNullable();
      table.decimal('budget', 12, 2).notNullable();
      table.decimal('spent', 12, 2).defaultTo(0);
      table.string('status').defaultTo('active');
      table.jsonb('targeting_rules');
      table.timestamp('start_date');
      table.timestamp('end_date');
      table.timestamps(true, true);
    })
    .createTable('bids', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('campaign_id').references('id').inTable('campaigns').onDelete('CASCADE');
      table.string('request_id').notNullable();
      table.decimal('price', 12, 2).notNullable();
      table.boolean('won').defaultTo(false);
      table.integer('latency_ms');
      table.timestamp('timestamp').defaultTo(knex.fn.now());
      table.index(['campaign_id', 'timestamp']);
      table.index(['timestamp']);
    })
    .createTable('metrics_snapshots', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.timestamp('timestamp').defaultTo(knex.fn.now());
      table.integer('requests_per_sec');
      table.decimal('p99_latency', 10, 2);
      table.decimal('availability', 5, 2);
      table.decimal('error_rate', 5, 2);
      table.index(['timestamp']);
    });
}

export function down(knex) {
  return knex.schema
    .dropTableIfExists('metrics_snapshots')
    .dropTableIfExists('bids')
    .dropTableIfExists('campaigns')
    .dropTableIfExists('users');
}

