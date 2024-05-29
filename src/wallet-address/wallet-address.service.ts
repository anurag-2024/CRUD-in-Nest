import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletAddress } from './wallet-address.entity';

@Injectable()
export class WalletAddressService {
  constructor(
    @InjectRepository(WalletAddress)
    private walletAddressRepository: Repository<WalletAddress>,
  ) {}

  async findAll(): Promise<WalletAddress[]> {
    try {
      return await this.walletAddressRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch wallet addresses');
    }
  }

  async findOne(id: number): Promise<WalletAddress> {
    try {
      const walletAddress = await this.walletAddressRepository.findOne({ where: { id } });
      if (!walletAddress) {
        throw new NotFoundException(`Wallet address with ID ${id} not found`);
      }
      return walletAddress;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch wallet address');
    }
  }

  async create(walletAddress: WalletAddress): Promise<WalletAddress> {
    try {
      return await this.walletAddressRepository.save(walletAddress);
    } catch (error) {
      throw new BadRequestException('Failed to create wallet address');
    }
  }

  async update(id: number, walletAddress: WalletAddress): Promise<WalletAddress> {
    try {
      const existingWalletAddress = await this.findOne(id);
      if (!existingWalletAddress) {
        throw new NotFoundException(`Wallet address with ID ${id} not found`);
      }
      await this.walletAddressRepository.update(id, walletAddress);
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update wallet address');
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const walletAddress = await this.findOne(id);
      if (!walletAddress) {
        throw new NotFoundException(`Wallet address with ID ${id} not found`);
      }
      await this.walletAddressRepository.delete(id);
      return { message: `Wallet address with ID ${id} successfully deleted` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete wallet address');
    }
  }
}
