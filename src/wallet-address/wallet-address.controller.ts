import { Controller, Get, Post, Body, Param, Delete, Put, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { WalletAddressService } from './wallet-address.service';
import { WalletAddress } from './wallet-address.entity';

@Controller('wallet-address')
export class WalletAddressController {
  constructor(private readonly walletAddressService: WalletAddressService) {}

  @Get()
  async findAll(): Promise<WalletAddress[]> {
    try {
      return await this.walletAddressService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch wallet addresses');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<WalletAddress> {
    try {
      const walletAddress = await this.walletAddressService.findOne(+id);
      if (!walletAddress) {
        throw new NotFoundException(`Wallet address with ID ${id} not found`);
      }
      return walletAddress;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch wallet address');
    }
  }

  @Post()
  async create(@Body() walletAddress: WalletAddress): Promise<WalletAddress> {
    try {
      return await this.walletAddressService.create(walletAddress);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create wallet address');
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() walletAddress: WalletAddress): Promise<WalletAddress> {
    try {
      const updatedWalletAddress = await this.walletAddressService.update(+id, walletAddress);
      if (!updatedWalletAddress) {
        throw new NotFoundException(`Wallet address with ID ${id} not found`);
      }
      return updatedWalletAddress;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update wallet address');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    try {
      const walletAddress = await this.walletAddressService.findOne(+id);
      if (!walletAddress) {
        throw new NotFoundException(`Wallet address with ID ${id} not found`);
      }
      await this.walletAddressService.remove(+id);
      return { message: `Wallet address with ID ${id} successfully deleted` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete wallet address');
    }
  }
}
