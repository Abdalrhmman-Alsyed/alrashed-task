import 'reflect-metadata';
import 'dotenv/config';
import { hash } from 'bcrypt';
import { DataSource } from 'typeorm';
import { User } from '../module/user/entity/user.entity';
import { Category } from '../module/categorie/entity/categorie.entity';
import { Brand } from '../module/brand/entity/brand.entity';
import { Product } from '../module/product/entity/product.entity';
import { ProductVariant } from '../module/product_variant/entity/product_variant.entity';
import { Address } from '../module/addresse/entity/addresse.entity';
import { Order } from '../module/order/entity/order.entity';
import { OrderItem } from '../module/order_item/entity/order_item.entity';
import { Review } from '../module/review/entity/review.entity';
import { Notification } from '../module/notification/entity/notification.entity';

const appDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT
    ? parseInt(process.env.DATABASE_PORT, 10)
    : 5432,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
  logging: false,
});

type SeedUserInput = {
  email: string;
  password: string;
  role: string;
  is_verified: boolean;
};

async function seedUsers(
  dataSource: DataSource,
): Promise<Record<string, User>> {
  const userRepo = dataSource.getRepository(User);

  const usersToSeed: SeedUserInput[] = [
    {
      email: 'admin@gmail.com',
      password: 'Admin123456',
      role: 'ADMIN',
      is_verified: true,
    },
    {
      email: 'user@gmail.com',
      password: 'User123456',
      role: 'USER',
      is_verified: true,
    },
  ];

  const result: Record<string, User> = {};

  for (const input of usersToSeed) {
    const existing = await userRepo.findOne({ where: { email: input.email } });

    if (existing) {
      console.log(`[EXISTS] user: ${input.email}`);
      result[input.email] = existing;
      continue;
    }

    const password_hash = await hash(input.password, 10);

    const created = userRepo.create({
      email: input.email,
      password_hash,
      role: input.role,
      is_verified: input.is_verified,
    });

    const saved = await userRepo.save(created);
    console.log(`[CREATED] user: ${input.email}`);
    result[input.email] = saved;
  }

  return result;
}

async function findOrCreateCategory(
  dataSource: DataSource,
  payload: {
    name: string;
    slug: string;
    description: string;
    parent?: Category | null;
  },
): Promise<Category> {
  const categoryRepo = dataSource.getRepository(Category);
  const existing = await categoryRepo.findOne({
    where: { slug: payload.slug },
  });

  if (existing) {
    console.log(`[EXISTS] category: ${payload.name}`);
    return existing;
  }

  const category = categoryRepo.create({
    name: payload.name,
    slug: payload.slug,
    description: payload.description,
    parent: payload.parent ?? null,
  });

  const saved = await categoryRepo.save(category);
  console.log(`[CREATED] category: ${payload.name}`);
  return saved;
}

async function seedCategories(
  dataSource: DataSource,
): Promise<Record<string, Category>> {
  const electronics = await findOrCreateCategory(dataSource, {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic devices and gadgets',
  });

  const fashion = await findOrCreateCategory(dataSource, {
    name: 'Fashion',
    slug: 'fashion',
    description: 'Fashion and apparel',
  });

  const phones = await findOrCreateCategory(dataSource, {
    name: 'Phones',
    slug: 'phones',
    description: 'Smartphones and mobile phones',
    parent: electronics,
  });

  const laptops = await findOrCreateCategory(dataSource, {
    name: 'Laptops',
    slug: 'laptops',
    description: 'Laptops and notebooks',
    parent: electronics,
  });

  const men = await findOrCreateCategory(dataSource, {
    name: 'Men',
    slug: 'men',
    description: "Men's fashion",
    parent: fashion,
  });

  const women = await findOrCreateCategory(dataSource, {
    name: 'Women',
    slug: 'women',
    description: "Women's fashion",
    parent: fashion,
  });

  return {
    Electronics: electronics,
    Fashion: fashion,
    Phones: phones,
    Laptops: laptops,
    Men: men,
    Women: women,
  };
}

async function seedBrands(
  dataSource: DataSource,
): Promise<Record<string, Brand>> {
  const brandRepo = dataSource.getRepository(Brand);
  const names = ['Apple', 'Samsung', 'Nike', 'Adidas'];
  const result: Record<string, Brand> = {};

  for (const name of names) {
    const existing = await brandRepo.findOne({ where: { name } });

    if (existing) {
      console.log(`[EXISTS] brand: ${name}`);
      result[name] = existing;
      continue;
    }

    const created = brandRepo.create({
      name,
      logo_url: null as unknown as string,
      description: `${name} official brand`,
    });

    const saved = await brandRepo.save(created);
    console.log(`[CREATED] brand: ${name}`);
    result[name] = saved;
  }

  return result;
}

async function findOrCreateProduct(
  dataSource: DataSource,
  payload: {
    name: string;
    slug: string;
    description: string;
    category: Category;
    brand: Brand;
  },
): Promise<Product> {
  const productRepo = dataSource.getRepository(Product);
  const existing = await productRepo.findOne({ where: { slug: payload.slug } });

  if (existing) {
    console.log(`[EXISTS] product: ${payload.name}`);
    return existing;
  }

  const product = productRepo.create({
    name: payload.name,
    slug: payload.slug,
    description: payload.description,
    is_active: true,
    category: payload.category,
    brand: payload.brand,
  });

  const saved = await productRepo.save(product);
  console.log(`[CREATED] product: ${payload.name}`);
  return saved;
}

async function seedProducts(
  dataSource: DataSource,
  categories: Record<string, Category>,
  brands: Record<string, Brand>,
): Promise<Record<string, Product>> {
  const iphone = await findOrCreateProduct(dataSource, {
    name: 'iPhone 15',
    slug: 'iphone-15',
    description: 'Apple iPhone 15 smartphone',
    category: categories.Phones,
    brand: brands.Apple,
  });

  const galaxy = await findOrCreateProduct(dataSource, {
    name: 'Samsung Galaxy S24',
    slug: 'samsung-galaxy-s24',
    description: 'Samsung Galaxy S24 smartphone',
    category: categories.Phones,
    brand: brands.Samsung,
  });

  const macbook = await findOrCreateProduct(dataSource, {
    name: 'MacBook Pro',
    slug: 'macbook-pro',
    description: 'Apple MacBook Pro laptop',
    category: categories.Laptops,
    brand: brands.Apple,
  });

  const nikeAirMax = await findOrCreateProduct(dataSource, {
    name: 'Nike Air Max',
    slug: 'nike-air-max',
    description: 'Nike Air Max running shoes',
    category: categories.Men,
    brand: brands.Nike,
  });

  const adidasJacket = await findOrCreateProduct(dataSource, {
    name: 'Adidas Jacket',
    slug: 'adidas-jacket',
    description: 'Adidas black jacket',
    category: categories.Women,
    brand: brands.Adidas,
  });

  return {
    'iPhone 15': iphone,
    'Samsung Galaxy S24': galaxy,
    'MacBook Pro': macbook,
    'Nike Air Max': nikeAirMax,
    'Adidas Jacket': adidasJacket,
  };
}

async function seedProductVariants(
  dataSource: DataSource,
  products: Record<string, Product>,
): Promise<void> {
  const variantRepo = dataSource.getRepository(ProductVariant);
  const variants = [
    {
      productName: 'iPhone 15',
      sku: 'IPH15-BLK-128',
      price: 999.99,
      stock_quantity: 50,
      attributes: { color: 'Black', storage: '128GB' },
    },
    {
      productName: 'Samsung Galaxy S24',
      sku: 'SGS24-GRY-256',
      price: 949.99,
      stock_quantity: 45,
      attributes: { color: 'Gray', storage: '256GB' },
    },
    {
      productName: 'MacBook Pro',
      sku: 'MBP-SLV-16-512',
      price: 2199.99,
      stock_quantity: 20,
      attributes: { color: 'Silver', ram: '16GB', storage: '512GB' },
    },
    {
      productName: 'Nike Air Max',
      sku: 'NAM-WHT-42',
      price: 149.99,
      stock_quantity: 100,
      attributes: { size: '42', color: 'White' },
    },
    {
      productName: 'Adidas Jacket',
      sku: 'ADJ-BLK-M',
      price: 89.99,
      stock_quantity: 80,
      attributes: { size: 'M', color: 'Black' },
    },
  ];

  for (const input of variants) {
    const existing = await variantRepo.findOne({ where: { sku: input.sku } });

    if (existing) {
      console.log(`[EXISTS] variant: ${input.sku}`);
      continue;
    }

    const created = variantRepo.create({
      sku: input.sku,
      price: input.price,
      stock_quantity: input.stock_quantity,
      attributes: input.attributes,
      product: products[input.productName],
    });

    await variantRepo.save(created);
    console.log(`[CREATED] variant: ${input.sku}`);
  }
}

async function seedSampleAddress(
  dataSource: DataSource,
  user: User | undefined,
): Promise<Address | null> {
  if (!user) {
    console.log('[SKIPPED] sample address: user@gmail.com not found');
    return null;
  }

  const addressRepo = dataSource.getRepository(Address);
  const existing = await addressRepo.findOne({
    where: {
      user: { id: user.id },
      type: 'home',
      street: '123 Main Street',
      city: 'Riyadh',
      state: 'Riyadh',
      zip_code: '11564',
    },
    relations: ['user'],
  });

  if (existing) {
    console.log('[EXISTS] sample address for user@gmail.com');
    return existing;
  }

  const created = addressRepo.create({
    type: 'home',
    street: '123 Main Street',
    city: 'Riyadh',
    state: 'Riyadh',
    zip_code: '11564',
    user,
  });

  const saved = await addressRepo.save(created);
  console.log('[CREATED] sample address for user@gmail.com');
  return saved;
}

async function seedSampleOrder(
  dataSource: DataSource,
  user: User | undefined,
  address: Address | null,
): Promise<Order | null> {
  if (!user || !address) {
    console.log('[SKIPPED] sample order: missing user or address');
    return null;
  }

  const orderRepo = dataSource.getRepository(Order);
  const existing = await orderRepo.findOne({
    where: {
      user: { id: user.id },
      status: 'SEED_SAMPLE',
    },
    relations: ['user'],
  });

  if (existing) {
    console.log('[EXISTS] sample order for user@gmail.com');
    return existing;
  }

  const created = orderRepo.create({
    status: 'SEED_SAMPLE',
    total_amount: 999.99,
    user,
    address,
  });

  const saved = await orderRepo.save(created);
  console.log('[CREATED] sample order for user@gmail.com');
  return saved;
}

async function seedSampleOrderItems(
  dataSource: DataSource,
  sampleOrder: Order | null,
): Promise<void> {
  if (!sampleOrder) {
    console.log('[SKIPPED] order item: sample order is missing');
    return;
  }

  const variantRepo = dataSource.getRepository(ProductVariant);
  const orderItemRepo = dataSource.getRepository(OrderItem);

  const variant = await variantRepo.findOne({
    where: { sku: 'IPH15-BLK-128' },
  });

  if (!variant) {
    console.log('[SKIPPED] order item: variant not found');
    return;
  }

  const existing = await orderItemRepo.findOne({
    where: {
      order: { id: sampleOrder.id },
      variant: { id: variant.id },
    },
    relations: ['order', 'variant'],
  });

  if (existing) {
    console.log('[EXISTS] order item: IPH15-BLK-128 for sample order');
    return;
  }

  const created = orderItemRepo.create({
    quantity: 1,
    unit_price_at_purchase: 999.99,
    order: sampleOrder,
    variant,
  });

  await orderItemRepo.save(created);
  console.log('[CREATED] order item: IPH15-BLK-128 for sample order');
}

async function seedSampleReviews(
  dataSource: DataSource,
  user: User | undefined,
  products: Record<string, Product>,
): Promise<void> {
  if (!user) {
    console.log('[SKIPPED] reviews: user@gmail.com not found');
    return;
  }

  const reviewRepo = dataSource.getRepository(Review);
  const reviewInputs = [
    {
      productName: 'iPhone 15',
      rating: 5,
      comment: 'Excellent phone, smooth performance and great camera.',
    },
    {
      productName: 'MacBook Pro',
      rating: 5,
      comment: 'Powerful laptop and perfect for development work.',
    },
    {
      productName: 'Nike Air Max',
      rating: 4,
      comment: 'Very comfortable shoes.',
    },
  ];

  for (const input of reviewInputs) {
    const product = products[input.productName];
    if (!product) {
      console.log(`[SKIPPED] review: product not found (${input.productName})`);
      continue;
    }

    const existing = await reviewRepo.findOne({
      where: {
        user: { id: user.id },
        product: { id: product.id },
      },
      relations: ['user', 'product'],
    });

    if (existing) {
      console.log(`[EXISTS] review for product: ${input.productName}`);
      continue;
    }

    const created = reviewRepo.create({
      rating: input.rating,
      comment: input.comment,
      user,
      product,
    });

    await reviewRepo.save(created);
    console.log(`[CREATED] review for product: ${input.productName}`);
  }
}

async function seedSampleNotifications(
  dataSource: DataSource,
  user: User | undefined,
): Promise<void> {
  if (!user) {
    console.log('[SKIPPED] notifications: user@gmail.com not found');
    return;
  }

  const notificationRepo = dataSource.getRepository(Notification);
  const notifications = [
    {
      title: 'Welcome to Task Alrashed',
      message: 'Your account has been created successfully.',
      type: 'WELCOME',
      is_read: false,
    },
    {
      title: 'Order Created',
      message: 'Your sample order has been created successfully.',
      type: 'ORDER',
      is_read: false,
    },
    {
      title: 'Payment Reminder',
      message:
        'Please complete your payment to continue processing your order.',
      type: 'PAYMENT',
      is_read: false,
    },
  ];

  for (const input of notifications) {
    const existing = await notificationRepo.findOne({
      where: {
        user: { id: user.id },
        title: input.title,
      },
      relations: ['user'],
    });

    if (existing) {
      console.log(`[EXISTS] notification: ${input.title}`);
      continue;
    }

    const created = notificationRepo.create({
      title: input.title,
      message: input.message,
      type: input.type,
      is_read: input.is_read,
      user,
    });

    await notificationRepo.save(created);
    console.log(`[CREATED] notification: ${input.title}`);
  }
}

async function runSeed(): Promise<void> {
  console.log('Starting database seed...');
  await appDataSource.initialize();

  try {
    const users = await seedUsers(appDataSource);
    const categories = await seedCategories(appDataSource);
    const brands = await seedBrands(appDataSource);
    const products = await seedProducts(appDataSource, categories, brands);
    await seedProductVariants(appDataSource, products);

    const normalUser = users['user@gmail.com'];
    const sampleAddress = await seedSampleAddress(appDataSource, normalUser);
    const sampleOrder = await seedSampleOrder(
      appDataSource,
      normalUser,
      sampleAddress,
    );
    await seedSampleOrderItems(appDataSource, sampleOrder);
    await seedSampleReviews(appDataSource, normalUser, products);
    await seedSampleNotifications(appDataSource, normalUser);

    console.log('Seed completed successfully.');
  } finally {
    await appDataSource.destroy();
    console.log('Database connection closed.');
  }
}

runSeed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
