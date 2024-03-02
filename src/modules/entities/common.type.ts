export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHERS = 'othere',
}
export enum Status {
  active = 1,
  inactive = 0,
}
export enum WarehouseStatus {
  active = 'active',
  inactive = 'inactive',
}

export enum InventoryStatus {
  sold = 'sold',
  partialy_sold = 'partialy_sold',
  not_sold = 'not_sold',
}

export enum VerificationEnums {
  verified = 'verified',
  no = 'not_verified',
  pending = 'pending',
  reviewed = 'reviewed',
}
export enum ApprovalStatus {
  verified = 'approved',
  pending = 'pending',
  reviewed = 'reviewed',
  decline = 'declined',
}
export enum RepaymentStatus {
  confirmed = 'confirmed',
  pending = 'pending',
  disputed = 'disputed',
  decline = 'declined',
}

export enum KYCLevel {
  level_one = 1,
  level_two = 2,
  level_three = 3,
}

export enum userCategory {
  admin = 'is_admin',
  user = 'is_user',
}

export enum InterestPaymentStatus {
  paid_upfront = 'paid',
  not_paid_upfront = 'not_paid',
}
export enum DaysAndWeekAndMonths {
  DAILY = 'daily',
  MONTHLY = 'monthly',
  WEEKLY = 'weekly',
  YEARLY = 'yearly',
}
